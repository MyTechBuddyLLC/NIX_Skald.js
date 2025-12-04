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

| Option            | Description                                        | Default Value                                                |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `rssUrl`          | The URL of the RSS feed to fetch.                  | `https://mytechbuddyblog.blogspot.com/feeds/posts/default`   |
| `containerId`     | The ID of the HTML element to render the widget in. | `blog-widget-container`                                     |
| `maxPosts`        | The maximum number of blog posts to display.       | `3`                                                          |
| `defaultImageUrl` | The URL of the default image to use for blog posts. | `https://via.placeholder.com/800x400.png?text=Blog+Post`       |

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

### Advanced Example

This example shows how to use the widget with a custom configuration.

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
            maxPosts: 5,
            defaultImageUrl: "https://via.placeholder.com/800x400.png?text=My+Blog+Post"
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
