# Blog Widget

A simple, reusable blog post widget that fetches and displays recent blog posts from an RSS feed. This widget is built with vanilla JavaScript, HTML, and CSS, and it has no external build dependencies.

## Features

-   Fetches and displays recent blog posts from any public RSS feed.
-   Easy to integrate into any HTML page.
-   Customizable configuration options.
-   Responsive design.
-   Dark theme support.

## Getting Started

To get started, you will need to include the `blog-widget.js` and `blog-widget.css` files in your HTML page.

### Prerequisites

There are no prerequisites for using this widget.

### Installation

1.  Download the `blog-widget.js` and `blog-widget.css` files.
2.  Place them in the same directory as your project's HTML file.
3.  Include the following lines in your HTML page:

```html
<link rel="stylesheet" href="blog-widget.css">
<script src="blog-widget.js"></script>
```

4.  Add a `div` element with the id `blog-widget-container` to your HTML page where you want the widget to appear.

```html
<div id="blog-widget-container"></div>
```

## Configuration

The widget can be configured by creating a `blogWidgetConfig` object in your HTML file before including the `blog-widget.js` script.

| Option | Description | Required | Default Value |
| --- | --- | --- | --- |
| `rssUrl` | The URL of the RSS feed to fetch. | Yes | `https://mytechbuddyblog.blogspot.com/feeds/posts/default` |
| `containerId` | The ID of the HTML element to render the widget in. | No | `blog-widget-container` |
| `maxPosts` | The maximum number of blog posts to display. | No | `3` |
| `defaultImageUrl` | The URL of the default image to use for blog posts. | No | `https://via.placeholder.com/800x400.png?text=Blog+Post` |
| `categoryPanel.enabled` | Whether to display the category panel. | No | `false` |
| `categoryPanel.label` | The title of the category panel. | No | `'Categories'` |
| `categoryPanel.tagPrefix` | The prefix to filter categories by. | No | `''` |
| `categoryPanel.panelPosition` | The position of the category panel. <br> Allowable values: `'first-card'`, `'last-card'` | No | `'first-card'` |
| `categoryPanel.orderBy` | The sort order for the categories. <br> Allowable values: `'alphabetical'`, `'most-recent'` | No | `'alphabetical'` |
| `categoryPanel.emptyMessage` | The message to display when no categories are found. | No | `'No categories found'` |


## Examples

### Basic Example

This example shows how to use the widget with the default configuration.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Widget</title>
    <link rel="stylesheet" href="blog-widget.css">
</head>
<body>
    <h1>My Blog</h1>
    <div id="blog-widget-container"></div>
    <script src="blog-widget.js"></script>
</body>
</html>
```

### Advanced Example with Category Panel

This example shows how to use the widget with a custom configuration that enables the category panel.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Widget</title>
    <link rel="stylesheet" href="blog-widget.css">
</head>
<body>
    <h1>My Blog</h1>
    <div id="my-blog-widget"></div>
    <script>
        const blogWidgetConfig = {
            rssUrl: "https://mytechbuddyblog.blogspot.com/feeds/posts/default",
            containerId: "my-blog-widget",
            maxPosts: 4,
            categoryPanel: {
                enabled: true,
                label: "Featured Series",
                tagPrefix: "Series:",
                panelPosition: "last-card",
                orderBy: "alphabetical"
            }
        };
    </script>
    <script src="blog-widget.js"></script>
</body>
</html>
```

## Styling

The widget can be styled by modifying the `blog-widget.css` file.

### Dark Theme

To enable the dark theme, add the `dark-theme` class to the `body` element of your HTML page.

```html
<body class="dark-theme">
    ...
</body>
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
