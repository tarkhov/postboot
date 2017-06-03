document.addEventListener('DOMContentLoaded', function () {
  let menus = document.querySelectorAll('.dropdown-fluid .dropdown-menu')
  if (menus.length) {
    menus.forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    })
  }
})
