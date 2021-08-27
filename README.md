# PostBoot

A library for quickly creating web applications using Bootstrap with a minimum amount of CSS code, maximum productivity and a huge number of components.

## Who uses it

Designed for beginners and professional web developers for projects of any level of complexity using in combination with the Bootstrap framework.

## Why use it

If you want to quickly prototype a web application using the Bootstrap framework and Postboot library, as well as support projects with long-term support.

### Contents

1. [Compatibility](#compatibility)
   1. [Version support](#version-support)
2. [Installation](#installation)
   1. [NodeJS](#nodejs)
   2. [Manually](#manually)
3. [Usage](#usage)
   1. [Local](#local)
   2. [CDN](#cdn)
4. [Author](#author)
5. [License](#license)

## Compatibility

Library | Version
------- | -------
Bootstrap | >= 5.0

PostBoot does **not overwrite** any components of Bootstrap, but only extends most of them. You can use it completely **safe**.

### Version support

Bootstrap | Repo
------- | -------
5.x | [2.x](https://github.com/tarkhov/postboot/tree/2.x)
4.x | [1.x](https://github.com/tarkhov/postboot/tree/1.x)

## Installation

### NodeJS

```bash
npm install postboot
```

### Manually

[Download](https://github.com/tarkhov/postboot/releases/download/v2.0.0/postboot.zip) package and unpack it or use following commands:

```bash
wget -O https://github.com/tarkhov/postboot/releases/download/v2.0.0/postboot.zip
unzip postboot.zip
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.rawgit.com/tarkhov/postboot/v2.0.0/dist/css/postboot.min.css">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.rawgit.com/tarkhov/postboot/v2.0.0/dist/js/postboot.min.js"></script>
```

## Author

**Alexander Tarkhov**

* [Facebook](https://www.facebook.com/alex.tarkhov)
* [Twitter](https://twitter.com/alextarkhov)
* [Medium](https://medium.com/@tarkhov)
* [LinkedIn](https://www.linkedin.com/in/tarkhov/)

## License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.
