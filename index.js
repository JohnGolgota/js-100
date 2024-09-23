const projects = [
  {
    name: 'Tetris',
    description: 'Crear el Tetris',
    tags: ['Canvas', 'Game', 'Eventos de teclado', 'Lógica'],
    links: [
      { name: 'GitHub', url: 'https://github.com/JohnGolgota/js-100' },
      { name: 'Demo', url: '/06-tetris-canvas/' }
    ]
  },
  {
    name: 'Paint.js',
    description: 'Crea un editor de imágenes clásico con canvas',
    tags: ['Canvas', 'Grid Area', 'EyeDropper API'],
    links: [
      { name: 'GitHub', url: 'https://github.com/JohnGolgota/js-100' },
      { name: 'Demo', url: '/09-paint-win-95/' }
    ]
  }
]

projects.forEach((project) => {
  const $project = document.createElement('div')
  $project.classList.add('project')
  $project.innerHTML = `
    <div class="project__header">
      <h2 class="project__title">${project.name}</h2>
      <p class="project__description">${project.description}</p>
    </div>
    <div class="project__tags">
      ${project.tags.map((tag) => `<span class="project__tag">${tag}</span>`).join('')}
    </div>
    <div class="project__links">
      ${project.links.map((link) => `<a class="project__link" href="${link.url}">${link.name}</a>`).join('')}
    </div>
  `
  document.querySelector('.projects').appendChild($project)
})
