// Selección del elemento nav
const nav = document.querySelector('nav');
let navActive = false; // Bandera para saber si el nav está activo o no

// Selección de los spans dentro del header para el efecto parallax
const headerSpan1 = document.querySelector('.header-1');
const headerSpan2 = document.querySelector('.header-2');
const headerSpan3 = document.querySelector('.header-3');

// Selección de las imágenes que están en el grid
const gridImg1 = document.querySelector('.grid-img--1');
const gridImg2 = document.querySelector('.grid-img--2');
const gridImg3 = document.querySelector('.grid-img--3');
const gridImg4 = document.querySelector('.grid-img--4');
const gridImg5 = document.querySelector('.grid-img--5');
const gridImg6 = document.querySelector('.grid-img--6');

// Coordenadas para las imágenes del grid
const gridCords = [
	{ w: 15, h: 50, left: 2, top: 5 },    // Configuración de la imagen 1
	{ w: 29, h: 30, left: 19, top: 5 },   // Configuración de la imagen 2
	{ w: 20, h: 40, left: 28, top: 57 },  // Configuración de la imagen 3
	{ w: 29, h: 18, left: 19, top: 37 },  // Configuración de la imagen 4
	{ w: 24, h: 20, left: 2, top: 57 },   // Configuración de la imagen 5
	{ w: 24, h: 18, left: 2, top: 79 }    // Configuración de la imagen 6
];

// Altura de la ventana para referencia
const section = window.innerHeight;

// Evento que se ejecuta cuando el usuario hace scroll
window.onscroll = function() {
	handleNavBar();          // Manejo del comportamiento de la barra de navegación
	handleHeaderParallax();  // Efecto de parallax en el header
	handleImageMorph();      // Animación y transformación de las imágenes
}

/**
 * Función para manejar el cambio de estado en la barra de navegación
 */
const handleNavBar = () => {
	// Si el scroll es mayor a 0 y la barra no está activa, activamos el cambio
	if (!navActive && window.scrollY > 0) {
		nav.classList.add('nav--active');
		navActive = true;
	}
	
	// Si el scroll vuelve a la parte superior, desactivamos el estado activo
	if (navActive && window.scrollY === 0) {
		nav.classList.remove('nav--active');
		navActive = false;
	}
}

/**
 * Función para aplicar el efecto parallax en los spans del header
 */
const handleHeaderParallax = () => {
	// Movimiento de los spans en función del scroll
	headerSpan1.style.transform = `translateY(${window.scrollY / 2.5}px)`;
	headerSpan2.style.transform = `translateY(${window.scrollY / 2.25}px)`;
	headerSpan3.style.transform = `translateY(${window.scrollY / 2}px)`;
}

/**
 * Función para animar y transformar las imágenes del grid
 */
const handleImageMorph = () => {
	// Aplicar la transformación a cada imagen con diferentes coordenadas y velocidad
	setMorpForEl(gridImg1, gridCords[0], 1.5);
	setMorpForEl(gridImg2, gridCords[1], 1.4);
	setMorpForEl(gridImg3, gridCords[2], 1.3);
	setMorpForEl(gridImg4, gridCords[3], 1.2);
	setMorpForEl(gridImg5, gridCords[4], 1.1);
	setMorpForEl(gridImg6, gridCords[5], 1);
}

/**
 * Función que establece la transformación de cada imagen según las coordenadas y el multiplicador
 * 
 * @param {Element} el - Elemento al que se aplicará la transformación
 * @param {Object} cords - Coordenadas de la imagen (width, height, left, top)
 * @param {Number} multiplier - Multiplicador para la velocidad de transformación
 */
const setMorpForEl = (el, cords, multiplier) => {
	// Transformamos el tamaño y la posición de la imagen basándonos en el scroll
	el.style.width = `${interpolate(window.scrollY, 0, section * 1.5, 55, cords.w)}%`;
	el.style.height = `${interpolate(window.scrollY, 0, section * 1.5, 100, cords.h)}vh`;
	el.style.left = `${interpolate(window.scrollY, 0, section * 1.5, 45, cords.left)}%`;
	el.style.top = `${interpolate(window.scrollY, 0, section * 1.5, 0, cords.top)}%`;
}

/**
 * Función que calcula la interpolación para suavizar las transiciones entre dos puntos
 * 
 * @param {Number} value - Valor actual
 * @param {Number} s1 - Punto inicial de la interpolación
 * @param {Number} s2 - Punto final de la interpolación
 * @param {Number} t1 - Valor inicial del destino
 * @param {Number} t2 - Valor final del destino
 * @param {Number} slope - Pendiente para suavizar (opcional)
 * @returns {Number} - Valor interpolado
 */
const interpolate = (value, s1, s2, t1, t2, slope = 0.5) => {
	// Si el valor está fuera de los rangos definidos, devolvemos el límite correspondiente
	if (value < Math.min(s1, s2)) return Math.min(s1, s2) === s1 ? t1 : t2;
	if (value > Math.max(s1, s2)) return Math.max(s1, s2) === s1 ? t1 : t2;

	// Invertir el valor en el eje Y para calcular
	value = s2 - value;

	// Definir puntos de control para la interpolación
	const C1 = { x: s1, y: t1 };
	const C3 = { x: s2, y: t2 };
	const C2 = {
		x: C3.x,
		y: C1.y + Math.abs(slope) * (C3.y - C1.y)
	};

	// Calcular el porcentaje de progreso de la interpolación
	const percent = value / (C3.x - C1.x);

	// Funciones de interpolación cúbica de Bezier
	return C1.y * b1(percent) + C2.y * b2(percent) + C3.y * b3(percent);

	// Curvas cúbicas de Bezier
	function b1(t) { return t * t; }
	function b2(t) { return 2 * t * (1 - t); }
	function b3(t) { return (1 - t) * (1 - t); }
}
