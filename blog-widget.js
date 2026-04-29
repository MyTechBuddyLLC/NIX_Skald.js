document.addEventListener("DOMContentLoaded", () => {
    const defaultConfig = {
        rssUrl: "https://mytechbuddyblog.blogspot.com/feeds/posts/default",
        containerId: "blog-widget-container",
        maxPosts: 3,
        defaultImageUrl: "https://via.placeholder.com/800x400.png?text=Blog+Post",
        categoryPanel: {
            enabled: false,
            label: "Categories",
            tagPrefix: "",
            panelPosition: "first-card", // 'first-card' or 'last-card'
            orderBy: "alphabetical", // 'alphabetical' or 'most-recent'
            emptyMessage: "No categories found"
        },
        showBlogLink: false,
        blogLinkText: 'View Blog',
        blogUrl: '',
        blogLinkTarget: '_blank'
    };

    // Deep merge the user's config with the default config
    const deepMerge = (defaults, userConfig) => {
        const merged = { ...defaults };
        for (const key in userConfig) {
            if (userConfig.hasOwnProperty(key)) {
                if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
                    merged[key] = deepMerge(defaults[key] || {}, userConfig[key]);
                } else {
                    merged[key] = userConfig[key];
                }
            }
        }
        return merged;
    };

    const config = typeof blogWidgetConfig !== 'undefined'
        ? deepMerge(defaultConfig, blogWidgetConfig)
        : defaultConfig;


    const fetchBlogPosts = async () => {
        const blogContainer = document.getElementById(config.containerId);
        if (!blogContainer) {
            console.error(`Blog container with id #${config.containerId} not found.`);
            return;
        }

        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.rssUrl)}`;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.status !== 'ok') {
                throw new Error(data.message);
            }

            const items = data.items;

            if (items.length === 0) {
                 blogContainer.innerHTML = '<p>No blog posts found.</p>';
                 return;
            }

            const postsContainer = document.createElement('div');
            postsContainer.className = 'blog-widget-posts-container';

            const fragment = document.createDocumentFragment();

            // --- Blog Post Display ---
            const postsToDisplay = items.slice(0, config.maxPosts);
            postsToDisplay.forEach(item => {
                const title = item.title;
                const link = item.link;

                // Create a temporary div to parse the description HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.description;

                // Extract image from description or use thumbnail/default
                let imageUrl = config.defaultImageUrl;
                const img = tempDiv.querySelector('img');

                if (img && img.src && img.src.startsWith('http')) {
                    imageUrl = img.src;
                } else if (item.thumbnail) {
                    // Use thumbnail, replace size for higher res
                    imageUrl = item.thumbnail.replace('/s72-c/', '/s800/');
                }

                // Create a snippet from the description
                const snippet = tempDiv.textContent.trim().substring(0, 100) + '...';

                const postElement = document.createElement('div');
                postElement.classList.add('blog-widget-post');
                postElement.innerHTML = `
                    <a href="${link}" target="_blank" rel="noopener noreferrer">
                        <div class="blog-widget-post-image-container">
                            <img src="${imageUrl}" alt="${title}" class="blog-widget-post-image">
                        </div>
                        <div class="blog-widget-post-content">
                            <h3 class="blog-widget-post-title">${title}</h3>
                            <p class="blog-widget-post-snippet">${snippet}</p>
                        </div>
                    </a>
                `;
                postsContainer.appendChild(postElement);
            });

            // --- Category Panel Logic ---
            if (config.categoryPanel.enabled) {
                const categories = {};
                const blogBaseUrl = new URL(data.feed.link).origin;

                items.forEach(item => {
                    if (item.categories && Array.isArray(item.categories)) {
                        item.categories.forEach(category => {
                            if (category.startsWith(config.categoryPanel.tagPrefix)) {
                                const categoryName = category.substring(config.categoryPanel.tagPrefix.length).trim();
                                if (categoryName) {
                                    if (!categories[categoryName]) {
                                        categories[categoryName] = {
                                            name: categoryName,
                                            url: `${blogBaseUrl}/search/label/${encodeURIComponent(categoryName)}`,
                                            lastUpdated: new Date(item.pubDate).getTime()
                                        };
                                    } else {
                                        categories[categoryName].lastUpdated = Math.max(
                                            categories[categoryName].lastUpdated,
                                            new Date(item.pubDate).getTime()
                                        );
                                    }
                                }
                            }
                        });
                    }
                });

                let sortedCategories = Object.values(categories);
                if (config.categoryPanel.orderBy === 'alphabetical') {
                    sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
                } else if (config.categoryPanel.orderBy === 'most-recent') {
                    sortedCategories.sort((a, b) => b.lastUpdated - a.lastUpdated);
                }

                const categoryPanel = document.createElement('div');
                categoryPanel.classList.add('blog-widget-post', 'blog-widget-category-panel');

                if (sortedCategories.length > 0) {
                    categoryPanel.innerHTML = `
                        <div class="blog-widget-post-content">
                            <h3 class="blog-widget-post-title">${config.categoryPanel.label}</h3>
                            <ul>
                                ${sortedCategories.map(c => `<li><a href="${c.url}">${c.name}</a></li>`).join('')}
                            </ul>
                        </div>
                    `;
                } else {
                    categoryPanel.innerHTML = `
                        <div class="blog-widget-post-content">
                            <p>${config.categoryPanel.emptyMessage}</p>
                        </div>
                    `;
                }

                if (config.categoryPanel.panelPosition === 'first-card') {
                    postsContainer.prepend(categoryPanel);
                } else { // 'last-card' is the default
                    postsContainer.appendChild(categoryPanel);
                }
            }

            fragment.appendChild(postsContainer);
            // Clear container and append the fragment
            blogContainer.innerHTML = '';
            blogContainer.appendChild(fragment);

            if (config.showBlogLink && config.blogUrl) {
                const blogLinkButton = document.createElement('a');
                blogLinkButton.href = config.blogUrl;
                blogLinkButton.textContent = config.blogLinkText;
                blogLinkButton.target = config.blogLinkTarget || '_blank';
                blogLinkButton.rel = 'noopener noreferrer';
                blogLinkButton.className = 'blog-widget-view-more-button';
                blogContainer.appendChild(blogLinkButton);
            }

        } catch (error) {
            console.error("Error fetching or parsing RSS feed:", error);
            blogContainer.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
        }
    };

    fetchBlogPosts();
});
