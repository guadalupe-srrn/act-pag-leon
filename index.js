document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE ACORDEÓN ---
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        header.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });

    // --- 2. BUSCADOR EN TIEMPO REAL ---
    const searchInput = document.getElementById('main-search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        cards.forEach(card => {
            const searchData = card.getAttribute('data-title');
            if (searchData.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
                card.classList.remove('active');
            }
        });
    });

    // --- 3. CONTADOR DE CUMPLEAÑOS (14 DE JUNIO) ---
    function updateCountdown() {
        const countdownElement = document.getElementById('countdown-container');
        const now = new Date();
        let currentYear = now.getFullYear();
        
        let birthday = new Date(currentYear, 5, 14); // Junio es mes 5
        
        if (now > birthday) {
            birthday.setFullYear(currentYear + 1);
        }
        
        const diffTime = birthday - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (now.getDate() === 14 && now.getMonth() === 5) {
            countdownElement.innerHTML = "🎉 <strong>¡HOY ES TU CUMPLEAÑOS, LEÓN! Felicidades.</strong> 🎉";
        } else {
            countdownElement.innerHTML = `Faltan <strong>${diffDays} días</strong> para tu cumpleaños (14 de Junio).`;
        }
    }
    updateCountdown();

    // --- 4. CATEGORÍA: COCINA (CON VISTA DETALLADA) ---
    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('my-recipes-list');

    let savedRecipes = JSON.parse(localStorage.getItem('leonRecipes')) || [];
    
    function renderRecipes() {
        recipeList.innerHTML = '';
        savedRecipes.forEach((recipe) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${recipe.name}</strong>
                <p class="recipe-detail">${recipe.steps.replace(/\n/g, '<br>')}</p>
            `;
            recipeList.appendChild(li);
        });
    }

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('recipe-name').value;
        const steps = document.getElementById('recipe-ingredients').value;

        savedRecipes.push({ name, steps });
        localStorage.setItem('leonRecipes', JSON.stringify(savedRecipes));
        
        renderRecipes();
        recipeForm.reset();
    });

    renderRecipes();

    // Inicializar los palitos del truco al cargar la página
    renderPalitos('ellos', puntosPartida.ellos);
    renderPalitos('nosotros', puntosPartida.nosotros);
});

// --- 5. LÓGICA TRADICIONAL DEL ANOTADOR DE TRUCO ---

// Objeto global para mantener el estado de los puntos
const puntosPartida = {
    ellos: 0,
    nosotros: 0
};

function cambiarPuntos(equipo, cantidad) {
    let puntos = puntosPartida[equipo] + cantidad;
    
    // El truco es de 0 a 30 puntos
    if (puntos < 0) puntos = 0;
    if (puntos > 30) puntos = 30;
    
    puntosPartida[equipo] = puntos;
    
    // Actualizar texto numérico informativo
    document.getElementById(`points-${equipo}`).innerText = `${puntos} Puntos`;
    
    // Redibujar gráficamente los palitos
    renderPalitos(equipo, puntos);

    if (puntos === 30) {
        alert(`¡Final del partido! Ganó el equipo de ${equipo.toUpperCase()}`);
    }
}

function renderPalitos(equipo, totalPuntos) {
    const contenedor = document.getElementById(`fosforos-${equipo}`);
    contenedor.innerHTML = ''; // Limpiar gráfico previo
    
    // Calculamos cuántos cuadraditos completos de 5 palitos necesitamos
    const cajasCompletas = Math.floor(totalPuntos / 5);
    const residuo = totalPuntos % 5;
    
    // 1. Dibujar los grupos completos de 5 palitos
    for (let i = 0; i < cajasCompletas; i++) {
        contenedor.appendChild(crearCajaDePalitos(5));
    }
    
    // 2. Dibujar el grupo incompleto sobrante si existe
    if (residuo > 0) {
        contenedor.appendChild(crearCajaDePalitos(residuo));
    }
}

// Función auxiliar que fabrica el HTML de los palitos dinámicamente
function crearCajaDePalitos(cantidadLineas) {
    const box = document.createElement('div');
    box.className = 'box-5';
    
    // Añade secuencialmente las clases CSS según el puntaje (hasta 5)
    for (let i = 1; i <= cantidadLineas; i++) {
        const linea = document.createElement('div');
        linea.className = `line line-${i}`;
        box.appendChild(linea);
    }
    return box;
}

function reiniciarTruco() {
    puntosPartida.ellos = 0;
    puntosPartida.nosotros = 0;
    
    document.getElementById('points-ellos').innerText = '0 Puntos';
    document.getElementById('points-nosotros').innerText = '0 Puntos';
    
    renderPalitos('ellos', 0);
    renderPalitos('nosotros', 0);
}