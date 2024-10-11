const projects = [
  {
    name: 'Tetris',
    description: 'Crear el Tetris',
    tags: ['Canvas', 'Game', 'Eventos de teclado', 'Lógica'],
    links: [
      { name: 'GitHub', url: 'https://github.com/JohnGolgota/js-100' },
      { name: 'Demo', url: './06-tetris-canvas/' }
    ]
  },
  {
    name: 'Paint.js',
    description: 'Crea un editor de imágenes clásico con canvas',
    tags: ['Canvas', 'Grid Area', 'EyeDropper API'],
    links: [
      { name: 'GitHub', url: 'https://github.com/JohnGolgota/js-100' },
      { name: 'Demo', url: './09-paint-win-95/' }
    ]
  },
  {
    name: 'Excel.js',
    description: 'Hojas de cálculo con JavaScript',
    tags: ['Tablas', 'Eventos de input y blur', 'Eval'],
    links: [
      { name: 'GitHub', url: 'https://github.com/JohnGolgota/js-100' },
      { name: 'Demo', url: './08-excel/' }
    ]
  },
  {
    name: 'Reto de Mecanografía',
    description: 'Pon a prueba tus habilidades de mecanografía con este reto',
    tags: [
      'DOM',
      'Eventos de teclado',
      'Manejo de clases',
      'Optimización selectores'
    ],
    links: [
      { name: 'GitHub', url: 'https://github.com/JohnGolgota/js-100' },
      { name: 'Demo', url: './03-monkeyType/' }
    ]
  }
]

projects.forEach((project) => {
  const $project = document.createElement('section')
  $project.classList.add('project')
  $project.innerHTML = `
    <div class="project__header">
      <h2 class="project__title">${project.name}</h2>
      <p class="project__description">${project.description}</p>
    </div>
    <ul class="project__tags">
      ${project.tags.map((tag) => `<li class="project__tag">${tag}</li>`).join('')}
    </ul>
    <ul class="project__links">
      ${project.links.map((link) => `<li><a class="project__link" href="${link.url}">${link.name}</a></li>`).join('')}
    </ul>
  `
  document.querySelector('.projects').appendChild($project)
})
