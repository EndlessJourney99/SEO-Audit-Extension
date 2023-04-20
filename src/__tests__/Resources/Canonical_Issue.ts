const Canonical_Single = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=0">
    <meta charset="ISO-8859-1">
    <link rel="canonical" href="https://example.com/dresses/green-dresses" />
    <meta name='robots' content='max-image-preview:large' />
    <!-- This site is optimized with the Yoast SEO Premium plugin v15.0 - https://yoast.com/wordpress/plugins/seo/ -->
</head>`;

const Canonical_Multiple = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=0">
    <meta charset="ISO-8859-1">
    <link rel="canonical" href="https://example.com/dresses/green-dresses" />
    <link rel="canonical" href="https://example.com/dresses/red-dresses" />
    <meta name='robots' content='max-image-preview:large' /> <!-- This site is optimized with the Yoast SEO Premium plugin v15.0 - https://yoast.com/wordpress/plugins/seo/ -->
</head>`;

const Canonical_Empty = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2.0, user-scalable=0">
    <meta charset="ISO-8859-1">
    <meta name='robots' content='max-image-preview:large' /> <!-- This site is optimized with the Yoast SEO Premium plugin v15.0 - https://yoast.com/wordpress/plugins/seo/ -->
</head>`;

export { Canonical_Single, Canonical_Multiple, Canonical_Empty };
