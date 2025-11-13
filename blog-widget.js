document.addEventListener("DOMContentLoaded", () => {
    const config = {
        rssUrl: "https://mytechbuddyblog.blogspot.com/feeds/posts/default",
        containerId: "blog-widget-container",
        maxPosts: 3,
        defaultImageUrl: "https://via.placeholder.com/800x400.png?text=Blog+Post"
    };

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

            blogContainer.innerHTML = ''; // Clear existing content
            const items = data.items.slice(0, config.maxPosts);

            if (items.length === 0) {
                 blogContainer.innerHTML = '<p>No blog posts found.</p>';
                 return;
            }

            items.forEach(item => {
                const title = item.title;
                const link = item.link;
                // Use thumbnail, replace size for higher res, or fallback to default
                const imageUrl = item.thumbnail ? item.thumbnail.replace('/s72-c/', '/s800/') : config.defaultImageUrl;

                // Create a snippet from the description
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.description;
                const snippet = tempDiv.textContent.trim().substring(0, 100) + '...';

                const postElement = document.createElement('div');
                postElement.classList.add('blog-post');
                postElement.innerHTML = `
                    <a href="${link}" target="_blank" rel="noopener noreferrer">
                        <img src="${imageUrl}" alt="${title}">
                        <h3>${title}</h3>
                        <p>${snippet}</p>
                    </a>
                `;
                blogContainer.appendChild(postElement);
            });

        } catch (error) {
            console.error("Error fetching or parsing RSS feed:", error);
            blogContainer.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
        }
    };

    fetchBlogPosts();
});