document.addEventListener("DOMContentLoaded", () => {
    const defaultConfig = {
        rssUrl: "https://mytechbuddyblog.blogspot.com/feeds/posts/default",
        containerId: "blog-widget-container",
        maxPosts: 3,
        defaultImageUrl: "https://via.placeholder.com/800x400.png?text=Blog+Post",
        series: {
            enabled: false,
            label: "Series",
            tagPrefix: "series-",
            menuPosition: "first-card", // 'first-card', 'last-card', 'top', 'bottom'
            orderBy: "alphabetical" // 'alphabetical', 'most-recent'
        }
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

            // --- Series Menu Logic ---
            if (config.series.enabled) {
                const series = {};
                const blogBaseUrl = new URL(data.feed.link).origin;

                items.forEach(item => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.description;
                    const postText = tempDiv.textContent || "";
                    const lines = postText.split('\n');


                    lines.forEach(line => {
                        if (line.trim().startsWith(config.series.tagPrefix)) {
                            // Extract text after the prefix, trim it, and remove surrounding quotes
                            const seriesName = line.substring(line.indexOf(config.series.tagPrefix) + config.series.tagPrefix.length).trim().replace(/^"|"$/g, '');
                            if (seriesName) {
                                if (!series[seriesName]) {
                                    series[seriesName] = {
                                        name: seriesName,
                                        url: `${blogBaseUrl}/search/label/${encodeURIComponent(seriesName)}`,
                                        lastUpdated: new Date(item.pubDate).getTime()
                                    };
                                } else {
                                    series[seriesName].lastUpdated = Math.max(
                                        series[seriesName].lastUpdated,
                                        new Date(item.pubDate).getTime()
                                    );
                                }
                            }
                        }
                    });
                });

                let sortedSeries = Object.values(series);
                if (config.series.orderBy === 'alphabetical') {
                    sortedSeries.sort((a, b) => a.name.localeCompare(b.name));
                } else if (config.series.orderBy === 'most-recent') {
                    sortedSeries.sort((a, b) => b.lastUpdated - a.lastUpdated);
                }

                if (sortedSeries.length > 0) {
                    const seriesMenu = document.createElement('div');
                    seriesMenu.id = 'blog-widget-series-menu'; // Assign an ID for easy selection
                    seriesMenu.classList.add('blog-widget-series-menu');
                    seriesMenu.innerHTML = `
                        <h3>${config.series.label}</h3>
                        <ul>
                            ${sortedSeries.map(s => `<li><a href="${s.url}">${s.name}</a></li>`).join('')}
                        </ul>
                    `;

                    // Handle 'top' and 'bottom' positions separately as they are outside the container
                    if (config.series.menuPosition === 'top') {
                        blogContainer.before(seriesMenu);
                    } else if (config.series.menuPosition === 'bottom') {
                        blogContainer.after(seriesMenu);
                    } else if (config.series.menuPosition === 'first-card') {
                        postsContainer.prepend(seriesMenu);
                    } else { // 'last-card' is the default
                        postsContainer.appendChild(seriesMenu);
                    }
                }
            }

            fragment.appendChild(postsContainer);
            // Clear container and append the fragment
            blogContainer.innerHTML = '';
            blogContainer.appendChild(fragment);

        } catch (error) {
            console.error("Error fetching or parsing RSS feed:", error);
            blogContainer.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
        }
    };

    fetchBlogPosts();
});
