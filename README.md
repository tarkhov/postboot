# PostBoot

Web app prototyping library based on Bootstrap framework.

### Contents

1. [Compatibility](#compatibility)
2. [Installation](#installation)
   1. [Manually](#manually)
   2. [NodeJS](#nodejs)
3. [Usage](#usage)
   1. [Local](#local)
   2. [CDN](#cdn)
4. [Author](#author)
5. [License](#license)

## Compatibility

Library | Version
------- | -------
Bootstrap | 4.3.1

PostBoot does **not overwrite** any components of Bootstrap, but only extends most of them.

## Installation

### Manually

[Download](https://github.com/tarkhov/postboot/releases/download/v1.0.0-rc4/postboot-1.0.0-rc4.zip) package and unpack it or use following commands:

```bash
wget -O https://github.com/tarkhov/postboot/releases/download/v1.0.0-rc4/postboot-1.0.0-rc4.zip
unzip postboot-1.0.0-rc4.zip
```

### NodeJS

```bash
npm install postboot@1.0.0-rc4
```

## Usage

### Local

```html
<!-- CSS -->
<link rel="stylesheet" href="css/bootstrap.min.css"/>
<link rel="stylesheet" href="css/postboot.min.css"/>

<!-- JS -->
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.bundle.min.js"></script>
<script src="js/postboot.min.js"></script>
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.rawgit.com/tarkhov/postboot/v1.0.0-rc4/dist/css/postboot.min.css">

<!-- JS -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script src="https://cdn.rawgit.com/tarkhov/postboot/v1.0.0-rc4/dist/js/postboot.min.js"></script>
```

## Author

**Alexander Tarkhov**

* [Facebook](https://www.facebook.com/alex.tarkhov)
* [Twitter](https://twitter.com/alextarkhov)
* [Medium](https://medium.com/@tarkhov)
* [Product Hunt](https://www.producthunt.com/@tarkhov)

## License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.
