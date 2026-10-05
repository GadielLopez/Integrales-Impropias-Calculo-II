/* ============================================================
   SISTEMA DE MODOS

   MODO CLASE
   ----------
   Enfocado en:
   - Calculadora
   - Gráfica
   - Resultado
   - Convergencia / divergencia
   - Procedimiento

   MODO AVANZADO
   --------------
   Incluye además:
   - Constructor de funciones
   - Exploración b -> infinito
   - Interpolación
   - Herramientas experimentales
   ============================================================ */


const CLAVE_MODO =
    "integrales-impropias-modo";


let modoHerramientasActual =
    localStorage.getItem(
        CLAVE_MODO
    )
    ||
    "avanzado";


/* ============================================================
   INICIO
   ============================================================ */

function iniciarSistemaModos() {

    crearEstilosModos();

    crearSelectorModos();

    aplicarModo(
        modoHerramientasActual,
        false
    );
}


/* ============================================================
   CREAR SELECTOR
   ============================================================ */

function crearSelectorModos() {

    /*
    Evitamos duplicarlo si por alguna razón
    el script se carga dos veces.
    */

    if (
        document.getElementById(
            "selectorNivelHerramientas"
        )
    ) {

        return;
    }


    const barraPrincipal =
        document.querySelector(
            ".barra-modos"
        );


    if (
        !barraPrincipal
    ) {

        return;
    }


    const contenedor =
        document.createElement(
            "section"
        );


    contenedor.id =
        "selectorNivelHerramientas";


    contenedor.className =
        "selector-nivel";


    contenedor.innerHTML =
        `
        <div class="selector-nivel-info">

            <div class="selector-nivel-icono">
                ∫
            </div>

            <div>

                <span class="selector-nivel-mini">
                    NIVEL DE HERRAMIENTAS
                </span>

                <strong id="tituloModoHerramientas">
                    Modo avanzado
                </strong>

                <p id="descripcionModoHerramientas">
                    Todas las herramientas interactivas están disponibles.
                </p>

            </div>

        </div>


        <div class="botones-modo-herramientas">

            <button
                id="btnModoClase"
                class="boton-modo-herramienta"
                type="button"
            >

                Modo Clase

            </button>


            <button
                id="btnModoAvanzado"
                class="boton-modo-herramienta"
                type="button"
            >

                Modo Avanzado

            </button>

        </div>
        `;


    barraPrincipal.insertAdjacentElement(
        "afterend",
        contenedor
    );


    document
        .getElementById(
            "btnModoClase"
        )
        .addEventListener(
            "click",
            () => {

                aplicarModo(
                    "clase"
                );

            }
        );


    document
        .getElementById(
            "btnModoAvanzado"
        )
        .addEventListener(
            "click",
            () => {

                aplicarModo(
                    "avanzado"
                );

            }
        );
}


/* ============================================================
   APLICAR MODO
   ============================================================ */

function aplicarModo(
    modo,
    guardar = true
) {

    if (
        modo !== "clase"
        &&
        modo !== "avanzado"
    ) {

        modo =
            "avanzado";
    }


    modoHerramientasActual =
        modo;


    document.body.classList.remove(
        "modo-clase"
    );


    document.body.classList.remove(
        "modo-avanzado"
    );


    document.body.classList.add(
        "modo-"
        +
        modo
    );


    if (
        guardar
    ) {

        localStorage.setItem(
            CLAVE_MODO,
            modo
        );
    }


    actualizarSelectorModo();


    /*
    Si estamos dentro del constructor
    y activamos Modo Clase,
    regresamos a la calculadora.
    */

    if (
        modo === "clase"
    ) {

        const vistaConstructor =
            document.getElementById(
                "vistaConstructor"
            );


        if (
            vistaConstructor
            &&
            vistaConstructor.classList.contains(
                "activa"
            )
        ) {

            if (
                typeof
                window.cambiarVista
                ===
                "function"
            ) {

                window.cambiarVista(
                    "calculadora"
                );
            }
        }
    }


    /*
    Plotly a veces necesita recalcular
    el tamaño al ocultar/mostrar elementos.
    */

    setTimeout(
        () => {

            window.dispatchEvent(
                new Event(
                    "resize"
                )
            );

        },
        150
    );
}


/* ============================================================
   ACTUALIZAR SELECTOR
   ============================================================ */

function actualizarSelectorModo() {

    const btnClase =
        document.getElementById(
            "btnModoClase"
        );


    const btnAvanzado =
        document.getElementById(
            "btnModoAvanzado"
        );


    const titulo =
        document.getElementById(
            "tituloModoHerramientas"
        );


    const descripcion =
        document.getElementById(
            "descripcionModoHerramientas"
        );


    if (
        !btnClase
        ||
        !btnAvanzado
        ||
        !titulo
        ||
        !descripcion
    ) {

        return;
    }


    btnClase.classList.remove(
        "activo"
    );


    btnAvanzado.classList.remove(
        "activo"
    );


    if (
        modoHerramientasActual
        ===
        "clase"
    ) {

        btnClase.classList.add(
            "activo"
        );


        titulo.textContent =
            "Modo Clase";


        descripcion.textContent =
            (
                "Enfocado en resolver, graficar y analizar "
                +
                "integrales sin mostrar herramientas adicionales."
            );


        return;
    }


    btnAvanzado.classList.add(
        "activo"
    );


    titulo.textContent =
        "Modo Avanzado";


    descripcion.textContent =
        (
            "Constructor, exploración de límites "
            +
            "y herramientas interactivas habilitadas."
        );
}


/* ============================================================
   CONSULTAR MODO
   ============================================================ */

function obtenerModoHerramientas() {

    return modoHerramientasActual;
}


window.obtenerModoHerramientas =
    obtenerModoHerramientas;


window.aplicarModoHerramientas =
    aplicarModo;


/* ============================================================
   ESTILOS
   ============================================================ */

function crearEstilosModos() {

    if (
        document.getElementById(
            "estilosSistemaModos"
        )
    ) {

        return;
    }


    const estilo =
        document.createElement(
            "style"
        );


    estilo.id =
        "estilosSistemaModos";


    estilo.textContent =
        `

        /* ====================================================
           SELECTOR DE NIVEL
           ==================================================== */

        .selector-nivel {

            width:
                min(
                    1450px,
                    94%
                );

            margin:
                -8px auto 20px;

            padding:
                14px 16px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            gap:
                20px;

            background:
                white;

            border:
                1px solid
                var(--borde);

            border-radius:
                14px;

            box-shadow:
                0 8px 25px
                rgba(
                    19,
                    33,
                    68,
                    0.05
                );
        }


        .selector-nivel-info {

            display:
                flex;

            align-items:
                center;

            gap:
                12px;
        }


        .selector-nivel-icono {

            width:
                42px;

            height:
                42px;

            flex-shrink:
                0;

            display:
                grid;

            place-items:
                center;

            border-radius:
                11px;

            background:
                #f0f4ff;

            color:
                #3563e9;

            font-family:
                Georgia,
                serif;

            font-size:
                24px;
        }


        .selector-nivel-mini {

            display:
                block;

            margin-bottom:
                2px;

            color:
                #7b8494;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1px;
        }


        .selector-nivel-info strong {

            display:
                block;

            color:
                #172033;

            font-size:
                15px;
        }


        .selector-nivel-info p {

            margin:
                3px 0 0;

            color:
                #687386;

            font-size:
                12px;
        }


        .botones-modo-herramientas {

            display:
                flex;

            gap:
                6px;

            padding:
                4px;

            flex-shrink:
                0;

            background:
                #f3f5f8;

            border-radius:
                10px;
        }


        .boton-modo-herramienta {

            padding:
                9px 14px;

            border:
                none;

            border-radius:
                7px;

            background:
                transparent;

            color:
                #687386;

            font-size:
                12px;

            font-weight:
                700;

            cursor:
                pointer;

            transition:
                0.15s ease;
        }


        .boton-modo-herramienta:hover {

            background:
                white;

            color:
                #172033;
        }


        .boton-modo-herramienta.activo {

            background:
                #3563e9;

            color:
                white;

            box-shadow:
                0 3px 10px
                rgba(
                    53,
                    99,
                    233,
                    0.20
                );
        }


        /* ====================================================
           MODO CLASE
           ==================================================== */


        /*
        Ocultamos la pestaña del constructor.
        */

        body.modo-clase
        #tabConstructor {

            display:
                none
                !important;
        }


        /*
        La barra de pestañas queda dedicada
        completamente a la calculadora.
        */

        body.modo-clase
        #tabCalculadora {

            flex:
                1;
        }


        /*
        Ocultamos la exploración visual b -> infinito.

        El análisis matemático original continúa
        funcionando normalmente.
        */

        body.modo-clase
        #panelExploracion {

            display:
                none
                !important;
        }


        /*
        Ocultamos el texto de herramientas
        arrastrables para mantener la interfaz
        más académica.
        */

        body.modo-clase
        .mensaje-interactivo {

            display:
                none
                !important;
        }


        /*
        En Modo Clase dejamos la leyenda
        más sencilla.
        */

        body.modo-clase
        .leyenda-item:nth-child(4) {

            display:
                none;
        }


        /*
        Pequeño indicador visual.
        */

        body.modo-clase
        .selector-nivel {

            border-color:
                #ced9fa;

            background:
                linear-gradient(
                    135deg,
                    #ffffff,
                    #f7f9ff
                );
        }


        /* ====================================================
           MODO AVANZADO
           ==================================================== */

        body.modo-avanzado
        .selector-nivel {

            border-color:
                #dcd4f6;

            background:
                linear-gradient(
                    135deg,
                    #ffffff,
                    #fbf9ff
                );
        }


        body.modo-avanzado
        .selector-nivel-icono {

            color:
                #7447d8;

            background:
                #f2edff;
        }


        /* ====================================================
           RESPONSIVE
           ==================================================== */

        @media (
            max-width: 760px
        ) {

            .selector-nivel {

                align-items:
                    stretch;

                flex-direction:
                    column;
            }


            .botones-modo-herramientas {

                width:
                    100%;
            }


            .boton-modo-herramienta {

                flex:
                    1;
            }

        }

        `;


    document.head.appendChild(
        estilo
    );
}


/* ============================================================
   EJECUTAR
   ============================================================ */

iniciarSistemaModos();