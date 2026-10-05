let constructorInicializado =
    false;


let tipoConstructorActual =
    "lineal";


let mapaControlesConstructor =
    {};


let actualizandoConstructor =
    false;


/* ============================================================
   ESTADOS
   ============================================================ */

const estadosConstructor = {

    lineal: {

        p1: {
            x: -2,
            y: -1
        },

        p2: {
            x: 2,
            y: 3
        }
    },


    parabola: {

        vertice: {
            x: 0,
            y: 0
        },

        punto: {
            x: 2,
            y: 4
        }
    },


    racional: {

        h: 0,

        k: 0,

        punto: {
            x: 2,
            y: 0.5
        }
    }

};


/* ============================================================
   INICIAR SOLO CUANDO ABRAMOS LA PESTAÑA
   ============================================================ */

function inicializarConstructorSiNecesario() {

    if (
        constructorInicializado
    ) {

        setTimeout(
            () => {

                Plotly.Plots.resize(
                    "graficaConstructor"
                );

            },
            100
        );


        return;
    }


    constructorInicializado =
        true;


    document
        .getElementById(
            "tipoConstructor"
        )
        .addEventListener(
            "change",
            evento => {

                tipoConstructorActual =
                    evento.target.value;


                restablecerConstructor();

            }
        );


    document
        .getElementById(
            "btnRestablecerConstructor"
        )
        .addEventListener(
            "click",
            restablecerConstructor
        );


    document
        .getElementById(
            "btnUsarFuncion"
        )
        .addEventListener(
            "click",
            usarFuncionEnCalculadora
        );


    dibujarConstructor();
}


window.inicializarConstructorSiNecesario =
    inicializarConstructorSiNecesario;


/* ============================================================
   RESETEAR
   ============================================================ */

function restablecerConstructor() {

    if (
        tipoConstructorActual
        ===
        "lineal"
    ) {

        estadosConstructor.lineal = {

            p1: {
                x: -2,
                y: -1
            },

            p2: {
                x: 2,
                y: 3
            }
        };
    }


    if (
        tipoConstructorActual
        ===
        "parabola"
    ) {

        estadosConstructor.parabola = {

            vertice: {
                x: 0,
                y: 0
            },

            punto: {
                x: 2,
                y: 4
            }
        };
    }


    if (
        tipoConstructorActual
        ===
        "racional"
    ) {

        estadosConstructor.racional = {

            h: 0,

            k: 0,

            punto: {
                x: 2,
                y: 0.5
            }
        };
    }


    dibujarConstructor();
}


/* ============================================================
   REDONDEO
   ============================================================ */

function redondear(
    numero,
    decimales = 3
) {

    const factor =
        Math.pow(
            10,
            decimales
        );


    return Math.round(
        numero
        *
        factor
    )
    /
    factor;
}


function numeroTexto(
    numero
) {

    const n =
        redondear(
            numero
        );


    if (
        Math.abs(n)
        <
        0.0001
    ) {

        return "0";
    }


    return String(
        n
    );
}


/* ============================================================
   PARÁMETROS
   ============================================================ */

function obtenerParametrosLineales() {

    const estado =
        estadosConstructor.lineal;


    let dx =
        estado.p2.x
        -
        estado.p1.x;


    if (
        Math.abs(dx)
        <
        0.15
    ) {

        estado.p2.x =
            estado.p1.x
            +
            0.15;


        dx =
            0.15;
    }


    const m =
        (
            estado.p2.y
            -
            estado.p1.y
        )
        /
        dx;


    const b =
        estado.p1.y
        -
        m
        *
        estado.p1.x;


    return {

        m:
            redondear(m),

        b:
            redondear(b)
    };
}


function obtenerParametrosParabola() {

    const estado =
        estadosConstructor.parabola;


    const h =
        estado.vertice.x;


    const k =
        estado.vertice.y;


    let dx =
        estado.punto.x
        -
        h;


    if (
        Math.abs(dx)
        <
        0.2
    ) {

        estado.punto.x =
            h
            +
            0.2;


        dx =
            0.2;
    }


    const a =
        (
            estado.punto.y
            -
            k
        )
        /
        (
            dx
            *
            dx
        );


    return {

        a:
            redondear(a),

        h:
            redondear(h),

        k:
            redondear(k)
    };
}


function obtenerParametrosRacional() {

    const estado =
        estadosConstructor.racional;


    let dx =
        estado.punto.x
        -
        estado.h;


    if (
        Math.abs(dx)
        <
        0.2
    ) {

        estado.punto.x =
            estado.h
            +
            0.2;


        dx =
            0.2;
    }


    let a =
        (
            estado.punto.y
            -
            estado.k
        )
        *
        dx;


    if (
        Math.abs(a)
        <
        0.03
    ) {

        a =
            a < 0
            ?
            -0.03
            :
            0.03;
    }


    return {

        a:
            redondear(a),

        h:
            redondear(
                estado.h
            ),

        k:
            redondear(
                estado.k
            )
    };
}


/* ============================================================
   LATEX
   ============================================================ */

function terminoConstante(
    numero
) {

    const n =
        redondear(
            numero
        );


    if (
        n === 0
    ) {

        return "";
    }


    if (
        n > 0
    ) {

        return "+"
        +
        numeroTexto(n);
    }


    return "-"
    +
    numeroTexto(
        Math.abs(n)
    );
}


function parentesisDesplazado(
    h
) {

    const n =
        redondear(
            h
        );


    if (
        n === 0
    ) {

        return "x";
    }


    if (
        n > 0
    ) {

        return (
            "\\left(x-"
            +
            numeroTexto(n)
            +
            "\\right)"
        );
    }


    return (
        "\\left(x+"
        +
        numeroTexto(
            Math.abs(n)
        )
        +
        "\\right)"
    );
}


function latexLineal() {

    const {
        m,
        b
    } =
        obtenerParametrosLineales();


    let terminoX;


    if (
        m === 1
    ) {

        terminoX =
            "x";

    } else if (
        m === -1
    ) {

        terminoX =
            "-x";

    } else if (
        m === 0
    ) {

        terminoX =
            "0";

    } else {

        terminoX =
            numeroTexto(m)
            +
            "x";
    }


    if (
        m === 0
    ) {

        return numeroTexto(
            b
        );
    }


    return (
        terminoX
        +
        terminoConstante(b)
    );
}


function latexParabola() {

    const {
        a,
        h,
        k
    } =
        obtenerParametrosParabola();


    const parentesis =
        parentesisDesplazado(
            h
        );


    let coeficiente;


    if (
        a === 1
    ) {

        coeficiente =
            "";

    } else if (
        a === -1
    ) {

        coeficiente =
            "-";

    } else {

        coeficiente =
            numeroTexto(a);
    }


    return (
        coeficiente
        +
        parentesis
        +
        "^2"
        +
        terminoConstante(k)
    );
}


function latexRacional() {

    const {
        a,
        h,
        k
    } =
        obtenerParametrosRacional();


    let denominador;


    if (
        h === 0
    ) {

        denominador =
            "x";

    } else if (
        h > 0
    ) {

        denominador =
            "x-"
            +
            numeroTexto(h);

    } else {

        denominador =
            "x+"
            +
            numeroTexto(
                Math.abs(h)
            );
    }


    return (
        "\\frac{"
        +
        numeroTexto(a)
        +
        "}{"
        +
        denominador
        +
        "}"
        +
        terminoConstante(k)
    );
}


function obtenerLatexActual() {

    if (
        tipoConstructorActual
        ===
        "lineal"
    ) {

        return latexLineal();
    }


    if (
        tipoConstructorActual
        ===
        "parabola"
    ) {

        return latexParabola();
    }


    return latexRacional();
}


/* ============================================================
   EVALUAR FUNCIÓN
   ============================================================ */

function evaluarConstructor(
    x
) {

    if (
        tipoConstructorActual
        ===
        "lineal"
    ) {

        const {
            m,
            b
        } =
            obtenerParametrosLineales();


        return (
            m * x
            +
            b
        );
    }


    if (
        tipoConstructorActual
        ===
        "parabola"
    ) {

        const {
            a,
            h,
            k
        } =
            obtenerParametrosParabola();


        return (
            a
            *
            Math.pow(
                x - h,
                2
            )
            +
            k
        );
    }


    const {
        a,
        h,
        k
    } =
        obtenerParametrosRacional();


    if (
        Math.abs(
            x - h
        )
        <
        0.03
    ) {

        return null;
    }


    const y =
        a
        /
        (
            x - h
        )
        +
        k;


    if (
        Math.abs(y)
        >
        30
    ) {

        return null;
    }


    return y;
}


/* ============================================================
   CURVA
   ============================================================ */

function generarCurvaConstructor() {

    const xs =
        [];


    const ys =
        [];


    const minimo =
        -10;


    const maximo =
        10;


    const cantidad =
        2200;


    for (
        let i = 0;
        i <= cantidad;
        i++
    ) {

        const x =
            minimo
            +
            (
                maximo
                -
                minimo
            )
            *
            i
            /
            cantidad;


        xs.push(
            x
        );


        ys.push(
            evaluarConstructor(
                x
            )
        );
    }


    return {

        x:
            xs,

        y:
            ys
    };
}


/* ============================================================
   CONTROL CIRCULAR
   ============================================================ */

function crearPuntoControl(
    shapes,
    annotations,
    nombre,
    x,
    y,
    texto
) {

    const radio =
        0.18;


    const indice =
        shapes.length;


    mapaControlesConstructor[
        indice
    ] =
        nombre;


    shapes.push(
        {

            type:
                "circle",

            x0:
                x - radio,

            x1:
                x + radio,

            y0:
                y - radio,

            y1:
                y + radio,

            editable:
                true,

            fillcolor:
                "#7447d8",

            line: {

                color:
                    "#5e35b1",

                width:
                    2
            }
        }
    );


    annotations.push(
        {

            x:
                x,

            y:
                y,

            text:
                texto,

            showarrow:
                true,

            arrowhead:
                2,

            ax:
                25,

            ay:
                -28,

            bgcolor:
                "#f2edff",

            bordercolor:
                "#d9ccf7",

            borderwidth:
                1,

            font: {

                color:
                    "#5e35b1"
            }
        }
    );
}


/* ============================================================
   CONTROLES POR FAMILIA
   ============================================================ */

function crearControlesLineales(
    shapes,
    annotations
) {

    const estado =
        estadosConstructor.lineal;


    crearPuntoControl(
        shapes,
        annotations,
        "lineal-p1",
        estado.p1.x,
        estado.p1.y,
        "P₁"
    );


    crearPuntoControl(
        shapes,
        annotations,
        "lineal-p2",
        estado.p2.x,
        estado.p2.y,
        "P₂"
    );
}


function crearControlesParabola(
    shapes,
    annotations
) {

    const estado =
        estadosConstructor.parabola;


    crearPuntoControl(
        shapes,
        annotations,
        "parabola-vertice",
        estado.vertice.x,
        estado.vertice.y,
        "V"
    );


    crearPuntoControl(
        shapes,
        annotations,
        "parabola-punto",
        estado.punto.x,
        estado.punto.y,
        "P"
    );
}


function crearControlesRacional(
    shapes,
    annotations
) {

    const estado =
        estadosConstructor.racional;


    let indice =
        shapes.length;


    mapaControlesConstructor[
        indice
    ] =
        "racional-h";


    shapes.push(
        {

            type:
                "line",

            x0:
                estado.h,

            x1:
                estado.h,

            y0:
                0,

            y1:
                1,

            yref:
                "paper",

            editable:
                true,

            line: {

                color:
                    "#7447d8",

                width:
                    2,

                dash:
                    "dash"
            }
        }
    );


    indice =
        shapes.length;


    mapaControlesConstructor[
        indice
    ] =
        "racional-k";


    shapes.push(
        {

            type:
                "line",

            x0:
                0,

            x1:
                1,

            xref:
                "paper",

            y0:
                estado.k,

            y1:
                estado.k,

            editable:
                true,

            line: {

                color:
                    "#7447d8",

                width:
                    2,

                dash:
                    "dash"
            }
        }
    );


    crearPuntoControl(
        shapes,
        annotations,
        "racional-punto",
        estado.punto.x,
        estado.punto.y,
        "P"
    );


    annotations.push(
        {

            x:
                estado.h,

            y:
                0.95,

            yref:
                "paper",

            text:
                "x = h",

            showarrow:
                false,

            bgcolor:
                "#f2edff",

            font: {

                color:
                    "#7447d8"
            }
        }
    );


    annotations.push(
        {

            x:
                0.02,

            xref:
                "paper",

            y:
                estado.k,

            text:
                "y = k",

            showarrow:
                false,

            bgcolor:
                "#f2edff",

            font: {

                color:
                    "#7447d8"
            }
        }
    );
}


/* ============================================================
   ACTUALIZAR INFORMACIÓN
   ============================================================ */

function actualizarInformacionConstructor() {

    const ecuacion =
        document.getElementById(
            "ecuacionConstructor"
        );


    ecuacion.value =
        "y="
        +
        obtenerLatexActual();


    const parametros =
        document.getElementById(
            "parametrosConstructor"
        );


    const ayuda =
        document.getElementById(
            "ayudaConstructor"
        );


    if (
        tipoConstructorActual
        ===
        "lineal"
    ) {

        const {
            m,
            b
        } =
            obtenerParametrosLineales();


        parametros.innerHTML =
            `
            <div class="parametro-constructor">
                <span>Pendiente m</span>
                <strong>${numeroTexto(m)}</strong>
            </div>

            <div class="parametro-constructor">
                <span>Intersección b</span>
                <strong>${numeroTexto(b)}</strong>
            </div>
            `;


        ayuda.textContent =
            (
                "Arrastra P₁ y P₂. "
                +
                "La pendiente y el término independiente "
                +
                "se calcularán automáticamente."
            );


        return;
    }


    if (
        tipoConstructorActual
        ===
        "parabola"
    ) {

        const {
            a,
            h,
            k
        } =
            obtenerParametrosParabola();


        parametros.innerHTML =
            `
            <div class="parametro-constructor">
                <span>Apertura a</span>
                <strong>${numeroTexto(a)}</strong>
            </div>

            <div class="parametro-constructor">
                <span>Desplazamiento h</span>
                <strong>${numeroTexto(h)}</strong>
            </div>

            <div class="parametro-constructor">
                <span>Desplazamiento k</span>
                <strong>${numeroTexto(k)}</strong>
            </div>
            `;


        ayuda.textContent =
            (
                "Arrastra V para mover el vértice. "
                +
                "Arrastra P para cambiar la apertura "
                +
                "de la parábola."
            );


        return;
    }


    const {
        a,
        h,
        k
    } =
        obtenerParametrosRacional();


    parametros.innerHTML =
        `
        <div class="parametro-constructor">
            <span>Factor a</span>
            <strong>${numeroTexto(a)}</strong>
        </div>

        <div class="parametro-constructor">
            <span>Asíntota x = h</span>
            <strong>${numeroTexto(h)}</strong>
        </div>

        <div class="parametro-constructor">
            <span>Asíntota y = k</span>
            <strong>${numeroTexto(k)}</strong>
        </div>
        `;


    ayuda.textContent =
        (
            "Arrastra la línea vertical para modificar h, "
            +
            "la horizontal para modificar k y el punto P "
            +
            "para modificar el factor a."
        );
}


/* ============================================================
   DIBUJAR
   ============================================================ */

function dibujarConstructor() {

    actualizarInformacionConstructor();


    const curva =
        generarCurvaConstructor();


    const traza =
        {

            x:
                curva.x,

            y:
                curva.y,

            type:
                "scatter",

            mode:
                "lines",

            connectgaps:
                false,

            line: {

                color:
                    "#315eb8",

                width:
                    3
            },

            hovertemplate:

                "x = %{x:.3f}"

                +

                "<br>"

                +

                "y = %{y:.3f}"

                +

                "<extra></extra>"
        };


    mapaControlesConstructor =
        {};


    const shapes =
        [];


    const annotations =
        [];


    if (
        tipoConstructorActual
        ===
        "lineal"
    ) {

        crearControlesLineales(
            shapes,
            annotations
        );
    }


    if (
        tipoConstructorActual
        ===
        "parabola"
    ) {

        crearControlesParabola(
            shapes,
            annotations
        );
    }


    if (
        tipoConstructorActual
        ===
        "racional"
    ) {

        crearControlesRacional(
            shapes,
            annotations
        );
    }


    const layout =
        {

            margin: {

                l:
                    60,

                r:
                    30,

                t:
                    35,

                b:
                    55
            },


            paper_bgcolor:
                "#ffffff",


            plot_bgcolor:
                "#ffffff",


            dragmode:
                "pan",


            hovermode:
                "closest",


            showlegend:
                false,


            xaxis: {

                title:
                    "x",

                range:
                    [-10, 10],

                gridcolor:
                    "#e3e8ef",

                zeroline:
                    true,

                zerolinewidth:
                    2,

                zerolinecolor:
                    "#596579"
            },


            yaxis: {

                title:
                    "y",

                range:
                    [-10, 10],

                gridcolor:
                    "#e3e8ef",

                zeroline:
                    true,

                zerolinewidth:
                    2,

                zerolinecolor:
                    "#596579"
            },


            shapes:
                shapes,


            annotations:
                annotations
        };


    const config =
        {

            responsive:
                true,

            scrollZoom:
                true,

            displaylogo:
                false,

            edits: {

                shapePosition:
                    true
            }
        };


    Plotly.react(
        "graficaConstructor",
        [
            traza
        ],
        layout,
        config
    )
    .then(
        configurarEventosConstructor
    );
}


/* ============================================================
   EVENTOS
   ============================================================ */

function configurarEventosConstructor(
    grafica
) {

    grafica.removeAllListeners(
        "plotly_relayout"
    );


    grafica.on(
        "plotly_relayout",
        evento => {

            procesarMovimientoConstructor(
                evento
            );

        }
    );
}


/* ============================================================
   CENTRO DE SHAPE
   ============================================================ */

function centroShape(
    shape
) {

    return {

        x:
            (
                Number(
                    shape.x0
                )
                +
                Number(
                    shape.x1
                )
            )
            /
            2,

        y:
            (
                Number(
                    shape.y0
                )
                +
                Number(
                    shape.y1
                )
            )
            /
            2
    };
}


/* ============================================================
   MOVIMIENTOS
   ============================================================ */

function procesarMovimientoConstructor(
    evento
) {

    if (
        actualizandoConstructor
    ) {

        return;
    }


    const claves =
        Object.keys(
            evento
        );


    let indiceEncontrado =
        null;


    for (
        const clave
        of claves
    ) {

        const match =
            clave.match(
                /^shapes\[(\d+)\]\./
            );


        if (
            match
        ) {

            indiceEncontrado =
                Number(
                    match[1]
                );

            break;
        }
    }


    if (
        indiceEncontrado
        ===
        null
    ) {

        return;
    }


    const control =
        mapaControlesConstructor[
            indiceEncontrado
        ];


    if (
        !control
    ) {

        return;
    }


    const grafica =
        document.getElementById(
            "graficaConstructor"
        );


    const shape =
        grafica.layout.shapes[
            indiceEncontrado
        ];


    if (
        !shape
    ) {

        return;
    }


    if (
        control === "lineal-p1"
    ) {

        const centro =
            centroShape(
                shape
            );


        estadosConstructor
            .lineal
            .p1 = centro;
    }


    if (
        control === "lineal-p2"
    ) {

        const centro =
            centroShape(
                shape
            );


        estadosConstructor
            .lineal
            .p2 = centro;
    }


    if (
        control === "parabola-vertice"
    ) {

        const centro =
            centroShape(
                shape
            );


        estadosConstructor
            .parabola
            .vertice =
                centro;
    }


    if (
        control === "parabola-punto"
    ) {

        const centro =
            centroShape(
                shape
            );


        estadosConstructor
            .parabola
            .punto =
                centro;
    }


    if (
        control === "racional-h"
    ) {

        estadosConstructor
            .racional
            .h =

                (
                    Number(
                        shape.x0
                    )
                    +
                    Number(
                        shape.x1
                    )
                )
                /
                2;
    }


    if (
        control === "racional-k"
    ) {

        estadosConstructor
            .racional
            .k =

                (
                    Number(
                        shape.y0
                    )
                    +
                    Number(
                        shape.y1
                    )
                )
                /
                2;
    }


    if (
        control === "racional-punto"
    ) {

        const centro =
            centroShape(
                shape
            );


        estadosConstructor
            .racional
            .punto =
                centro;
    }


    actualizandoConstructor =
        true;


    setTimeout(
        () => {

            dibujarConstructor();


            actualizandoConstructor =
                false;

        },
        30
    );
}


/* ============================================================
   ENVIAR A CALCULADORA
   ============================================================ */

function usarFuncionEnCalculadora() {

    const latex =
        obtenerLatexActual();


    if (
        typeof
        window
            .abrirCalculadoraConFuncion
        ===
        "function"
    ) {

        window
            .abrirCalculadoraConFuncion(
                latex
            );
    }
}