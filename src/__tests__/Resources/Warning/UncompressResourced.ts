const resource = /* html */ `
<html lang="en" data-user-theme="dark" class="js-focus-visible" data-js-focus-visible="">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0" name="viewport">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/regular/latin.woff2" rel="preload">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/bold/latin.woff2" rel="preload">
    <link href="https://web-dev.imgix.net" rel="preconnect">
    <meta content="#fff" name="theme-color">
    <link rel="stylesheet" href="/compressed/resources/style.css">
    <link rel="stylesheet" href="/uncompressed/resources/style.css">
    <link rel="stylesheet" href="https://external.com/uncompressed/resources/style.css">

    <title>It's time to lazy-load offscreen iframes!</title>
</head>

<body class="">


<script src="https://example.com/compressed/resources/abc.js"></script>
<script src="/compressed/resources/abc2.js"></script>
<script src="https://external.com/compressed/resources/abc2.js"></script>

<script src="https://external.com/uncompressed/resources/xyz1.js"></script>
<script src="/uncompressed/resources/xyz2.js"></script>

</body>
</html>`;

export default resource;
