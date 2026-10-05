const COLOR_FUNCION =
    "#1769aa";


const COLOR_SINGULARIDAD =
    "#c83d4b";


const COLOR_LIMITE =
    "#3563e9";


const COLOR_EXPLORACION =
    "#18a567";


const COLORES_TRAMOS = [

    {
        relleno:
            "rgba(53, 99, 233, 0.22)",

        borde:
            "rgba(53, 99, 233, 0.62)"
    },

    {
        relleno:
            "rgba(116, 71, 216, 0.20)",

        borde:
            "rgba(116, 71, 216, 0.60)"
    },

    {
        relleno:
            "rgba(24, 165, 103, 0.20)",

        borde:
            "rgba(24, 165, 103, 0.60)"
    },

    {
        relleno:
            "rgba(226, 153, 42, 0.20)",

        borde:
            "rgba(226, 153, 42, 0.60)"
    },

    {
        relleno:
            "rgba(200, 61, 75, 0.17)",

        borde:
            "rgba(200, 61, 75, 0.55)"
    }

];


let contextoGraficaActual =
    null;


let estadoExploracion =
    null;


let mapaShapes =
    {};


function crearGraficaInicial() {

    crearEstilosTramos();

    crearPanelTramos();


    const layout = {

        margin: {

            l: 60,

            r: 25,

            t: 30,

            b: 55
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
                "f(x)",

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
        }
    };


    const config = {

        responsive:
            true,

        scrollZoom:
            true,

        displaylogo:
            false,

        edits: {

            shapePosition:
                true
        },

        modeBarButtonsToRemove: [

            "lasso2d",

            "select2d"
        ]
    };


    Plotly.newPlot(
        "grafica",
        [],
        layout,
        config
    )
    .then(
        configurarEventosGrafica
    );
}


function construirPotenciaReal(
    base,
    numerador,
    denominador
) {

    if (
        denominador % 2 === 0
    ) {

        return (
            "("
            +
            base
            +
            ")^("
            +
            numerador
            +
            "/"
            +
            denominador
            +
            ")"
        );
    }


    const numeradorAbsoluto =
        Math.abs(
            numerador
        );


    let potenciaPositiva;


    if (
        numeradorAbsoluto % 2 === 1
    ) {

        potenciaPositiva =
            (
                "sign("
                +
                base
                +
                ")*"
                +
                "abs("
                +
                base
                +
                ")^("
                +
                numeradorAbsoluto
                +
                "/"
                +
                denominador
                +
                ")"
            );

    } else {

        potenciaPositiva =
            (
                "abs("
                +
                base
                +
                ")^("
                +
                numeradorAbsoluto
                +
                "/"
                +
                denominador
                +
                ")"
            );
    }


    if (
        numerador < 0
    ) {

        return (
            "(1/("
            +
            potenciaPositiva
            +
            "))"
        );
    }


    return (
        "("
        +
        potenciaPositiva
        +
        ")"
    );
}


function convertirPotenciasRacionalesRealesTexto(
    expresion
) {

    let texto =
        String(
            expresion
        );


    const patronBaseParentesis =
        /\(([^()]+)\)\s*\*\*\s*\(\s*(-?\d+)\s*\/\s*(\d+)\s*\)/g;


    texto = texto.replace(
        patronBaseParentesis,
        (
            coincidencia,
            contenidoBase,
            numeradorTexto,
            denominadorTexto
        ) => {

            const base =
                "("
                +
                contenidoBase
                +
                ")";


            const numerador =
                Number(
                    numeradorTexto
                );


            const denominador =
                Number(
                    denominadorTexto
                );


            return construirPotenciaReal(
                base,
                numerador,
                denominador
            );
        }
    );


    const patronBaseSimple =
        /\b([a-zA-Z][a-zA-Z0-9_]*)\s*\*\*\s*\(\s*(-?\d+)\s*\/\s*(\d+)\s*\)/g;


    texto = texto.replace(
        patronBaseSimple,
        (
            coincidencia,
            base,
            numeradorTexto,
            denominadorTexto
        ) => {

            const numerador =
                Number(
                    numeradorTexto
                );


            const denominador =
                Number(
                    denominadorTexto
                );


            return construirPotenciaReal(
                base,
                numerador,
                denominador
            );
        }
    );


    return texto;
}


function prepararExpresion(
    expresion
) {

    let texto =
        String(
            expresion
        );


    texto =
        convertirPotenciasRacionalesRealesTexto(
            texto
        );


    texto = texto
        .replaceAll(
            "**",
            "^"
        )
        .replace(
            /\bE\b/g,
            "e"
        )
        .replace(
            /\bAbs\(/g,
            "abs("
        );


    return texto;
}


function valorNumerico(
    valor
) {

    const texto =
        String(
            valor
        )
        .trim();


    if (
        texto === "oo"
        ||
        texto === "inf"
        ||
        texto === "Infinity"
    ) {

        return Infinity;
    }


    if (
        texto === "-oo"
        ||
        texto === "-inf"
        ||
        texto === "-Infinity"
    ) {

        return -Infinity;
    }


    try {

        const resultado =
            math.evaluate(
                texto
            );


        const numero =
            Number(
                resultado
            );


        if (
            Number.isFinite(
                numero
            )
        ) {

            return numero;
        }

    } catch (
        error
    ) {

        console.warn(
            "No se pudo convertir:",
            valor
        );
    }


    return NaN;
}


function compilarFuncion(
    expresion
) {

    try {

        const preparada =
            prepararExpresion(
                expresion
            );


        console.log(
            "Función SymPy:",
            expresion
        );


        console.log(
            "Función preparada para gráfica:",
            preparada
        );


        return math.compile(
            preparada
        );

    } catch (
        error
    ) {

        console.error(
            "Error compilando función:",
            error
        );


        return null;
    }
}


function evaluarY(
    funcion,
    valorX
) {

    try {

        let resultado =
            funcion.evaluate(
                {
                    x:
                        valorX
                }
            );


        if (
            resultado !== null
            &&
            typeof resultado === "object"
        ) {

            if (
                "re" in resultado
                &&
                "im" in resultado
            ) {

                if (
                    Math.abs(
                        resultado.im
                    )
                    >
                    1e-10
                ) {

                    return null;
                }


                resultado =
                    resultado.re;

            } else {

                resultado =
                    Number(
                        resultado
                    );
            }
        }


        const numero =
            Number(
                resultado
            );


        if (
            !Number.isFinite(
                numero
            )
        ) {

            return null;
        }


        if (
            Math.abs(
                numero
            )
            >
            80
        ) {

            return null;
        }


        return numero;


    } catch {

        return null;
    }
}


function formatearNumero(
    numero,
    decimales = 3
) {

    if (
        !Number.isFinite(
            numero
        )
    ) {

        return String(
            numero
        );
    }


    return Number(
        numero.toFixed(
            decimales
        )
    ).toString();
}


function configurarExploracion() {

    const panel =
        document.getElementById(
            "panelExploracion"
        );


    if (
        !panel
    ) {

        return;
    }


    const inferior =
        valorNumerico(
            contextoGraficaActual
                .limiteInferior
        );


    const superior =
        valorNumerico(
            contextoGraficaActual
                .limiteSuperior
        );


    estadoExploracion =
        null;


    if (
        Number.isFinite(
            inferior
        )
        &&
        superior === Infinity
    ) {

        estadoExploracion = {

            tipo:
                "superior",

            parametro:
                "b",

            valor:
                inferior + 5,

            minimo:
                inferior + 0.1,

            maximo:
                inferior + 100,

            base:
                inferior
        };
    }


    if (
        inferior === -Infinity
        &&
        Number.isFinite(
            superior
        )
    ) {

        estadoExploracion = {

            tipo:
                "inferior",

            parametro:
                "a",

            valor:
                superior - 5,

            minimo:
                superior - 100,

            maximo:
                superior - 0.1,

            base:
                superior
        };
    }


    if (
        !estadoExploracion
    ) {

        panel.classList.add(
            "oculto"
        );


        return;
    }


    panel.classList.remove(
        "oculto"
    );


    configurarSliderExploracion();


    actualizarPanelExploracion();
}


function configurarSliderExploracion() {

    const slider =
        document.getElementById(
            "sliderInfinito"
        );


    if (
        !slider
    ) {

        return;
    }


    slider.min =
        estadoExploracion.minimo;


    slider.max =
        estadoExploracion.maximo;


    slider.step =
        0.1;


    slider.value =
        estadoExploracion.valor;


    slider.oninput =
        () => {

            estadoExploracion.valor =
                Number(
                    slider.value
                );


            actualizarPanelExploracion();


            redibujarGraficaActual();
        };


    document
        .querySelectorAll(
            ".btn-distancia"
        )
        .forEach(
            boton => {

                boton.onclick =
                    () => {

                        const distancia =
                            Number(
                                boton.dataset.distancia
                            );


                        if (
                            estadoExploracion.tipo
                            ===
                            "superior"
                        ) {

                            estadoExploracion.valor =
                                estadoExploracion.base
                                +
                                distancia;

                        } else {

                            estadoExploracion.valor =
                                estadoExploracion.base
                                -
                                distancia;
                        }


                        estadoExploracion.valor =
                            Math.max(
                                estadoExploracion.minimo,
                                Math.min(
                                    estadoExploracion.maximo,
                                    estadoExploracion.valor
                                )
                            );


                        slider.value =
                            estadoExploracion.valor;


                        actualizarPanelExploracion();


                        redibujarGraficaActual();
                    };

            }
        );
}


function actualizarPanelExploracion() {

    if (
        !estadoExploracion
    ) {

        return;
    }


    const valor =
        estadoExploracion.valor;


    const badge =
        document.getElementById(
            "parametroExploracion"
        );


    const valorTexto =
        document.getElementById(
            "valorParametroExploracion"
        );


    const texto =
        document.getElementById(
            "textoExploracion"
        );


    const formula =
        document.getElementById(
            "formulaExploracion"
        );


    const integralParcial =
        document.getElementById(
            "valorIntegralParcial"
        );


    if (
        !badge
        ||
        !valorTexto
        ||
        !texto
        ||
        !formula
        ||
        !integralParcial
    ) {

        return;
    }


    if (
        estadoExploracion.tipo
        ===
        "superior"
    ) {

        badge.textContent =
            "b → ∞";


        valorTexto.textContent =
            "b = "
            +
            formatearNumero(
                valor
            );


        texto.textContent =
            (
                "Mueve b cada vez más hacia la derecha "
                +
                "para observar si la integral se aproxima "
                +
                "a un valor finito."
            );


        formula.value =
            (
                "\\int_{"
                +
                contextoGraficaActual
                    .limiteInferiorLatex
                +
                "}^{b}"
                +
                contextoGraficaActual
                    .funcionLatex
                +
                "\\,dx"
            );

    } else {

        badge.textContent =
            "a → -∞";


        valorTexto.textContent =
            "a = "
            +
            formatearNumero(
                valor
            );


        texto.textContent =
            (
                "Mueve a cada vez más hacia la izquierda "
                +
                "para observar el comportamiento de la integral."
            );


        formula.value =
            (
                "\\int_{a}^{"
                +
                contextoGraficaActual
                    .limiteSuperiorLatex
                +
                "}"
                +
                contextoGraficaActual
                    .funcionLatex
                +
                "\\,dx"
            );
    }


    const aproximacion =
        calcularIntegralParcial();


    if (
        aproximacion === null
    ) {

        integralParcial.textContent =
            "No disponible";

    } else {

        integralParcial.textContent =
            "≈ "
            +
            formatearNumero(
                aproximacion,
                8
            );
    }
}


function calcularIntegralParcial() {

    if (
        !estadoExploracion
        ||
        !contextoGraficaActual
    ) {

        return null;
    }


    const funcion =
        contextoGraficaActual
            .funcionCompilada;


    let inicio;
    let fin;


    if (
        estadoExploracion.tipo
        ===
        "superior"
    ) {

        inicio =
            valorNumerico(
                contextoGraficaActual
                    .limiteInferior
            );


        fin =
            estadoExploracion.valor;

    } else {

        inicio =
            estadoExploracion.valor;


        fin =
            valorNumerico(
                contextoGraficaActual
                    .limiteSuperior
            );
    }


    if (
        !Number.isFinite(
            inicio
        )
        ||
        !Number.isFinite(
            fin
        )
        ||
        inicio >= fin
    ) {

        return null;
    }


    const singularidades =
        contextoGraficaActual
            .singularidades
            .map(
                valorNumerico
            )
            .filter(
                Number.isFinite
            );


    const singularidadInterior =
        singularidades.some(
            punto =>
                punto > inicio
                &&
                punto < fin
        );


    if (
        singularidadInterior
    ) {

        return null;
    }


    const longitud =
        fin - inicio;


    const epsilon =
        Math.max(
            longitud / 100000,
            0.000001
        );


    if (
        singularidades.some(
            punto =>
                Math.abs(
                    punto - inicio
                )
                <
                epsilon * 10
        )
    ) {

        inicio +=
            epsilon;
    }


    if (
        singularidades.some(
            punto =>
                Math.abs(
                    punto - fin
                )
                <
                epsilon * 10
        )
    ) {

        fin -=
            epsilon;
    }


    const pasos =
        4000;


    const h =
        (
            fin - inicio
        )
        /
        pasos;


    let acumulado =
        0;


    let yAnterior =
        evaluarY(
            funcion,
            inicio
        );


    if (
        yAnterior === null
    ) {

        return null;
    }


    for (
        let i = 1;
        i <= pasos;
        i++
    ) {

        const xActual =
            inicio
            +
            i * h;


        const yActual =
            evaluarY(
                funcion,
                xActual
            );


        if (
            yActual === null
        ) {

            return null;
        }


        acumulado +=
            (
                yAnterior
                +
                yActual
            )
            *
            h
            /
            2;


        yAnterior =
            yActual;
    }


    return acumulado;
}


function obtenerRangoVisual() {

    const inferior =
        valorNumerico(
            contextoGraficaActual
                .limiteInferior
        );


    const superior =
        valorNumerico(
            contextoGraficaActual
                .limiteSuperior
        );


    if (
        Number.isFinite(
            inferior
        )
        &&
        Number.isFinite(
            superior
        )
    ) {

        const distancia =
            Math.abs(
                superior
                -
                inferior
            );


        const margen =
            Math.max(
                2,
                distancia * 0.5
            );


        return {

            minimo:
                inferior - margen,

            maximo:
                superior + margen
        };
    }


    if (
        Number.isFinite(
            inferior
        )
        &&
        superior === Infinity
    ) {

        const visual =
            estadoExploracion
            ?
            estadoExploracion.valor
            :
            inferior + 10;


        return {

            minimo:
                inferior - 2,

            maximo:
                Math.max(
                    inferior + 12,
                    visual + 2
                )
        };
    }


    if (
        inferior === -Infinity
        &&
        Number.isFinite(
            superior
        )
    ) {

        const visual =
            estadoExploracion
            ?
            estadoExploracion.valor
            :
            superior - 10;


        return {

            minimo:
                Math.min(
                    superior - 12,
                    visual - 2
                ),

            maximo:
                superior + 2
        };
    }


    return {

        minimo:
            -10,

        maximo:
            10
    };
}


function obtenerSingularidadesNumericas() {

    if (
        !contextoGraficaActual
    ) {

        return [];
    }


    return contextoGraficaActual
        .singularidades
        .map(
            valorNumerico
        )
        .filter(
            Number.isFinite
        );
}


function cercaDeSingularidad(
    valorX,
    tolerancia
) {

    return obtenerSingularidadesNumericas()
        .some(
            punto =>
                Math.abs(
                    valorX
                    -
                    punto
                )
                <=
                tolerancia
        );
}


function generarCurva(
    minimo,
    maximo
) {

    const xs =
        [];


    const ys =
        [];


    const cantidad =
        3200;


    const paso =
        (
            maximo
            -
            minimo
        )
        /
        cantidad;


    const tolerancia =
        Math.max(
            paso * 1.2,
            0.000001
        );


    for (
        let i = 0;
        i <= cantidad;
        i++
    ) {

        const valorX =
            minimo
            +
            paso
            *
            i;


        xs.push(
            valorX
        );


        if (
            cercaDeSingularidad(
                valorX,
                tolerancia
            )
        ) {

            ys.push(
                null
            );


            continue;
        }


        ys.push(
            evaluarY(
                contextoGraficaActual
                    .funcionCompilada,
                valorX
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


function esSingularidadNumerica(
    valor
) {

    return obtenerSingularidadesNumericas()
        .some(
            punto =>
                Math.abs(
                    punto
                    -
                    valor
                )
                <
                0.00001
        );
}


function obtenerExtremosAreaVisual(
    rango
) {

    let inicio =
        valorNumerico(
            contextoGraficaActual
                .limiteInferior
        );


    let fin =
        valorNumerico(
            contextoGraficaActual
                .limiteSuperior
        );


    if (
        estadoExploracion
    ) {

        if (
            estadoExploracion.tipo
            ===
            "superior"
        ) {

            fin =
                estadoExploracion.valor;
        }


        if (
            estadoExploracion.tipo
            ===
            "inferior"
        ) {

            inicio =
                estadoExploracion.valor;
        }
    }


    if (
        !Number.isFinite(
            inicio
        )
    ) {

        inicio =
            rango.minimo;
    }


    if (
        !Number.isFinite(
            fin
        )
    ) {

        fin =
            rango.maximo;
    }


    return {

        inicio:
            inicio,

        fin:
            fin
    };
}


function obtenerTramosVisuales(
    rango
) {

    const extremos =
        obtenerExtremosAreaVisual(
            rango
        );


    const singularidades =
        obtenerSingularidadesNumericas()
            .filter(
                punto =>
                    punto
                    >
                    extremos.inicio
                    &&
                    punto
                    <
                    extremos.fin
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a - b
            );


    const fronteras = [

        extremos.inicio,

        ...singularidades,

        extremos.fin
    ];


    const tramos =
        [];


    for (
        let i = 0;
        i < fronteras.length - 1;
        i++
    ) {

        if (
            fronteras[
                i + 1
            ]
            <=
            fronteras[i]
        ) {

            continue;
        }


        tramos.push(
            {

                inicio:
                    fronteras[i],

                fin:
                    fronteras[
                        i + 1
                    ],

                singularInicio:
                    esSingularidadNumerica(
                        fronteras[i]
                    ),

                singularFin:
                    esSingularidadNumerica(
                        fronteras[
                            i + 1
                        ]
                    )
            }
        );
    }


    return tramos;
}


function generarDatosAreaTramo(
    tramo
) {

    let inicio =
        tramo.inicio;


    let fin =
        tramo.fin;


    const longitud =
        Math.abs(
            fin
            -
            inicio
        );


    const epsilon =
        Math.max(
            longitud / 2500,
            0.00001
        );


    if (
        tramo.singularInicio
    ) {

        inicio +=
            epsilon;
    }


    if (
        tramo.singularFin
    ) {

        fin -=
            epsilon;
    }


    if (
        inicio >= fin
    ) {

        return {

            x: [],

            y: []
        };
    }


    const xs =
        [];


    const ys =
        [];


    const cantidad =
        1000;


    const paso =
        (
            fin
            -
            inicio
        )
        /
        cantidad;


    for (
        let i = 0;
        i <= cantidad;
        i++
    ) {

        const valorX =
            inicio
            +
            i
            *
            paso;


        xs.push(
            valorX
        );


        ys.push(
            evaluarY(
                contextoGraficaActual
                    .funcionCompilada,
                valorX
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


function crearTrazasAreas(
    rango
) {

    const tramos =
        obtenerTramosVisuales(
            rango
        );


    return tramos.map(
        (
            tramo,
            indice
        ) => {

            const datos =
                generarDatosAreaTramo(
                    tramo
                );


            const colores =
                COLORES_TRAMOS[
                    indice
                    %
                    COLORES_TRAMOS.length
                ];


            return {

                x:
                    datos.x,

                y:
                    datos.y,

                type:
                    "scatter",

                mode:
                    "lines",

                name:
                    "Tramo "
                    +
                    (
                        indice + 1
                    ),

                connectgaps:
                    false,

                fill:
                    "tozeroy",

                fillcolor:
                    colores.relleno,

                line: {

                    color:
                        colores.borde,

                    width:
                        1
                },

                hovertemplate:

                    "<b>Tramo "
                    +
                    (
                        indice + 1
                    )
                    +
                    "</b>"
                    +
                    "<br>x = %{x:.4f}"
                    +
                    "<br>f(x) = %{y:.4f}"
                    +
                    "<extra></extra>"
            };
        }
    );
}


function crearLimitesReales(
    shapes
) {

    const inferior =
        valorNumerico(
            contextoGraficaActual
                .limiteInferior
        );


    const superior =
        valorNumerico(
            contextoGraficaActual
                .limiteSuperior
        );


    if (
        Number.isFinite(
            inferior
        )
    ) {

        const indice =
            shapes.length;


        mapaShapes[
            indice
        ] =
            "inferior";


        shapes.push(
            {

                type:
                    "line",

                x0:
                    inferior,

                x1:
                    inferior,

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
                        COLOR_LIMITE,

                    width:
                        3,

                    dash:
                        "dot"
                }
            }
        );
    }


    if (
        Number.isFinite(
            superior
        )
    ) {

        const indice =
            shapes.length;


        mapaShapes[
            indice
        ] =
            "superior";


        shapes.push(
            {

                type:
                    "line",

                x0:
                    superior,

                x1:
                    superior,

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
                        COLOR_LIMITE,

                    width:
                        3,

                    dash:
                        "dot"
                }
            }
        );
    }
}


function crearLineaExploracion(
    shapes,
    annotations
) {

    if (
        !estadoExploracion
    ) {

        return;
    }


    const indice =
        shapes.length;


    mapaShapes[
        indice
    ] =
        "exploracion";


    shapes.push(
        {

            type:
                "line",

            x0:
                estadoExploracion.valor,

            x1:
                estadoExploracion.valor,

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
                    COLOR_EXPLORACION,

                width:
                    3,

                dash:
                    "dash"
            }
        }
    );


    annotations.push(
        {

            x:
                estadoExploracion.valor,

            y:
                1,

            yref:
                "paper",

            text:
                estadoExploracion.parametro
                +
                " = "
                +
                formatearNumero(
                    estadoExploracion.valor
                ),

            showarrow:
                false,

            yanchor:
                "bottom",

            bgcolor:
                "#ecf9f2",

            bordercolor:
                "#bfe7d2",

            borderwidth:
                1,

            font: {

                color:
                    "#118653",

                size:
                    12
            }
        }
    );
}


function crearSingularidades(
    shapes,
    annotations
) {

    contextoGraficaActual
        .singularidades
        .forEach(
            singularidad => {

                const punto =
                    valorNumerico(
                        singularidad
                    );


                if (
                    !Number.isFinite(
                        punto
                    )
                ) {

                    return;
                }


                shapes.push(
                    {

                        type:
                            "line",

                        x0:
                            punto,

                        x1:
                            punto,

                        y0:
                            0,

                        y1:
                            1,

                        yref:
                            "paper",

                        editable:
                            false,

                        line: {

                            color:
                                COLOR_SINGULARIDAD,

                            width:
                                2,

                            dash:
                                "dash"
                        }
                    }
                );


                annotations.push(
                    {

                        x:
                            punto,

                        y:
                            1,

                        yref:
                            "paper",

                        text:
                            "x = "
                            +
                            singularidad,

                        showarrow:
                            false,

                        yanchor:
                            "bottom",

                        bgcolor:
                            "#fff0f2",

                        bordercolor:
                            "#ffd5da",

                        borderwidth:
                            1,

                        borderpad:
                            4,

                        font: {

                            color:
                                COLOR_SINGULARIDAD,

                            size:
                                12
                        }
                    }
                );

            }
        );
}


function textoExtremo(
    valor
) {

    const numero =
        valorNumerico(
            valor
        );


    if (
        numero === Infinity
    ) {

        return "∞";
    }


    if (
        numero === -Infinity
    ) {

        return "−∞";
    }


    return String(
        valor
    );
}


function obtenerTramosMatematicos() {

    const inferior =
        contextoGraficaActual
            .limiteInferior;


    const superior =
        contextoGraficaActual
            .limiteSuperior;


    const inferiorNumero =
        valorNumerico(
            inferior
        );


    const superiorNumero =
        valorNumerico(
            superior
        );


    const singularidadesOrdenadas =
        contextoGraficaActual
            .singularidades
            .map(
                valor => {

                    return {

                        texto:
                            String(
                                valor
                            ),

                        numero:
                            valorNumerico(
                                valor
                            )
                    };
                }
            )
            .filter(
                elemento => {

                    if (
                        !Number.isFinite(
                            elemento.numero
                        )
                    ) {

                        return false;
                    }


                    const cumpleInferior =

                        inferiorNumero === -Infinity

                        ||

                        elemento.numero
                        >=
                        inferiorNumero;


                    const cumpleSuperior =

                        superiorNumero === Infinity

                        ||

                        elemento.numero
                        <=
                        superiorNumero;


                    return (
                        cumpleInferior
                        &&
                        cumpleSuperior
                    );
                }
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.numero
                    -
                    b.numero
            );


    const fronteras =
        [];


    fronteras.push(
        {

            texto:
                textoExtremo(
                    inferior
                ),

            numero:
                inferiorNumero,

            singular:
                singularidadesOrdenadas
                    .some(
                        punto =>
                            Number.isFinite(
                                inferiorNumero
                            )
                            &&
                            Math.abs(
                                punto.numero
                                -
                                inferiorNumero
                            )
                            <
                            0.00001
                    )
        }
    );


    singularidadesOrdenadas
        .forEach(
            punto => {

                const yaExiste =
                    fronteras.some(
                        frontera =>
                            Number.isFinite(
                                frontera.numero
                            )
                            &&
                            Math.abs(
                                frontera.numero
                                -
                                punto.numero
                            )
                            <
                            0.00001
                    );


                if (
                    !yaExiste
                ) {

                    fronteras.push(
                        {

                            texto:
                                punto.texto,

                            numero:
                                punto.numero,

                            singular:
                                true
                        }
                    );
                }

            }
        );


    const superiorYaExiste =
        fronteras.some(
            frontera =>
                Number.isFinite(
                    frontera.numero
                )
                &&
                Number.isFinite(
                    superiorNumero
                )
                &&
                Math.abs(
                    frontera.numero
                    -
                    superiorNumero
                )
                <
                0.00001
        );


    if (
        !superiorYaExiste
    ) {

        fronteras.push(
            {

                texto:
                    textoExtremo(
                        superior
                    ),

                numero:
                    superiorNumero,

                singular:
                    singularidadesOrdenadas
                        .some(
                            punto =>
                                Number.isFinite(
                                    superiorNumero
                                )
                                &&
                                Math.abs(
                                    punto.numero
                                    -
                                    superiorNumero
                                )
                                <
                                0.00001
                        )
            }
        );
    }


    if (
        inferiorNumero === -Infinity
        &&
        superiorNumero === Infinity
        &&
        singularidadesOrdenadas.length === 0
    ) {

        fronteras.splice(
            1,
            0,
            {

                texto:
                    "0",

                numero:
                    0,

                singular:
                    false,

                divisionAuxiliar:
                    true
            }
        );
    }


    const tramos =
        [];


    for (
        let i = 0;
        i < fronteras.length - 1;
        i++
    ) {

        const izquierda =
            fronteras[i];


        const derecha =
            fronteras[
                i + 1
            ];


        const simboloIzquierdo =

            izquierda.numero === -Infinity

            ||

            izquierda.singular

            ?

            "("

            :

            "[";


        const simboloDerecho =

            derecha.numero === Infinity

            ||

            derecha.singular

            ?

            ")"

            :

            "]";


        tramos.push(
            {

                texto:

                    simboloIzquierdo

                    +

                    izquierda.texto

                    +

                    ", "

                    +

                    derecha.texto

                    +

                    simboloDerecho,

                izquierda:
                    izquierda,

                derecha:
                    derecha
            }
        );
    }


    return tramos;
}


function crearPanelTramos() {

    if (
        document.getElementById(
            "panelTramosIntegracion"
        )
    ) {

        return;
    }


    const leyenda =
        document.querySelector(
            ".leyenda-grafica"
        );


    if (
        !leyenda
    ) {

        return;
    }


    const panel =
        document.createElement(
            "section"
        );


    panel.id =
        "panelTramosIntegracion";


    panel.className =
        "panel-tramos oculto";


    panel.innerHTML =
        `
        <div class="tramos-header">

            <div>

                <span class="tramos-mini">
                    DESCOMPOSICIÓN
                </span>

                <h3>
                    Tramos de integración
                </h3>

            </div>

            <span
                id="cantidadTramos"
                class="cantidad-tramos"
            >
            </span>

        </div>

        <p class="tramos-explicacion">

            Cada región se analiza de forma independiente.
            Si un tramo diverge, la integral impropia completa
            también diverge.

        </p>

        <div
            id="listaTramosIntegracion"
            class="lista-tramos"
        >
        </div>
        `;


    leyenda.insertAdjacentElement(
        "afterend",
        panel
    );
}


function actualizarPanelTramos() {

    crearPanelTramos();


    const panel =
        document.getElementById(
            "panelTramosIntegracion"
        );


    const lista =
        document.getElementById(
            "listaTramosIntegracion"
        );


    const cantidad =
        document.getElementById(
            "cantidadTramos"
        );


    if (
        !panel
        ||
        !lista
        ||
        !cantidad
    ) {

        return;
    }


    const tramos =
        obtenerTramosMatematicos();


    lista.innerHTML =
        "";


    if (
        tramos.length <= 1
    ) {

        panel.classList.add(
            "oculto"
        );


        return;
    }


    panel.classList.remove(
        "oculto"
    );


    cantidad.textContent =
        tramos.length
        +
        (
            tramos.length === 1
            ?
            " tramo"
            :
            " tramos"
        );


    tramos.forEach(
        (
            tramo,
            indice
        ) => {

            const colores =
                COLORES_TRAMOS[
                    indice
                    %
                    COLORES_TRAMOS.length
                ];


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "tramo-item";


            elemento.innerHTML =
                `
                <span
                    class="tramo-color"
                    style="
                        background:
                        ${colores.borde};
                    "
                ></span>

                <div>

                    <span>
                        Tramo ${indice + 1}
                    </span>

                    <strong>
                        ${tramo.texto}
                    </strong>

                </div>
                `;


            lista.appendChild(
                elemento
            );

        }
    );
}


function redibujarGraficaActual() {

    if (
        !contextoGraficaActual
    ) {

        return;
    }


    actualizarPanelTramos();


    const rango =
        obtenerRangoVisual();


    const curva =
        generarCurva(
            rango.minimo,
            rango.maximo
        );


    const trazasAreas =
        crearTrazasAreas(
            rango
        );


    const trazaFuncion = {

        x:
            curva.x,

        y:
            curva.y,

        type:
            "scatter",

        mode:
            "lines",

        name:
            "f(x)",

        connectgaps:
            false,

        line: {

            color:
                COLOR_FUNCION,

            width:
                3
        },

        hovertemplate:

            "x = %{x:.4f}"

            +

            "<br>"

            +

            "f(x) = %{y:.4f}"

            +

            "<extra></extra>"
    };


    mapaShapes =
        {};


    const shapes =
        [];


    const annotations =
        [];


    crearLimitesReales(
        shapes
    );


    crearLineaExploracion(
        shapes,
        annotations
    );


    crearSingularidades(
        shapes,
        annotations
    );


    const layout = {

        margin: {

            l: 60,

            r: 25,

            t: 45,

            b: 55
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

            range: [

                rango.minimo,

                rango.maximo
            ],

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
                "f(x)",

            autorange:
                true,

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


    const config = {

        responsive:
            true,

        scrollZoom:
            true,

        displaylogo:
            false,

        edits: {

            shapePosition:
                true
        },

        modeBarButtonsToRemove: [

            "lasso2d",

            "select2d"
        ]
    };


    Plotly.react(
        "grafica",
        [

            ...trazasAreas,

            trazaFuncion

        ],
        layout,
        config
    )
    .then(
        configurarEventosGrafica
    );
}


function configurarEventosGrafica(
    grafica
) {

    grafica.removeAllListeners(
        "plotly_relayout"
    );


    grafica.on(
        "plotly_relayout",
        evento => {

            procesarMovimientoShape(
                evento
            );

        }
    );
}


function procesarMovimientoShape(
    evento
) {

    const claves =
        Object.keys(
            evento
        );


    for (
        const clave
        of
        claves
    ) {

        const coincidencia =
            clave.match(
                /^shapes\[(\d+)\]\.x0$/
            );


        if (
            !coincidencia
        ) {

            continue;
        }


        const indice =
            Number(
                coincidencia[1]
            );


        const tipo =
            mapaShapes[
                indice
            ];


        if (
            !tipo
        ) {

            continue;
        }


        const nuevoValor =
            Number(
                evento[
                    clave
                ]
            );


        if (
            !Number.isFinite(
                nuevoValor
            )
        ) {

            continue;
        }


        if (
            tipo === "inferior"
            ||
            tipo === "superior"
        ) {

            if (
                typeof
                window
                    .actualizarLimiteDesdeGrafica
                ===
                "function"
            ) {

                window
                    .actualizarLimiteDesdeGrafica(
                        tipo,
                        nuevoValor
                    );
            }


            return;
        }


        if (
            tipo === "exploracion"
            &&
            estadoExploracion
        ) {

            estadoExploracion.valor =
                Math.max(
                    estadoExploracion.minimo,
                    Math.min(
                        estadoExploracion.maximo,
                        nuevoValor
                    )
                );


            const slider =
                document.getElementById(
                    "sliderInfinito"
                );


            if (
                slider
            ) {

                slider.value =
                    estadoExploracion.valor;
            }


            actualizarPanelExploracion();


            redibujarGraficaActual();


            return;
        }
    }
}


function graficarFuncion(
    expresionSympy,
    limiteInferior,
    limiteSuperior,
    singularidades,
    funcionLatex,
    limiteInferiorLatex,
    limiteSuperiorLatex
) {

    const funcion =
        compilarFuncion(
            expresionSympy
        );


    if (
        !funcion
    ) {

        return;
    }


    contextoGraficaActual = {

        expresionSympy:
            expresionSympy,

        funcionCompilada:
            funcion,

        funcionLatex:
            funcionLatex
            ||
            expresionSympy,

        limiteInferior:
            limiteInferior,

        limiteSuperior:
            limiteSuperior,

        limiteInferiorLatex:
            limiteInferiorLatex
            ||
            limiteInferior,

        limiteSuperiorLatex:
            limiteSuperiorLatex
            ||
            limiteSuperior,

        singularidades:
            singularidades
            ||
            []
    };


    configurarExploracion();


    actualizarPanelTramos();


    redibujarGraficaActual();
}


function crearEstilosTramos() {

    if (
        document.getElementById(
            "estilosTramosIntegracion"
        )
    ) {

        return;
    }


    const estilos =
        document.createElement(
            "style"
        );


    estilos.id =
        "estilosTramosIntegracion";


    estilos.textContent =
        `

        .panel-tramos {

            margin-top:
                14px;

            padding:
                16px;

            border:
                1px solid
                #dce3ec;

            border-radius:
                12px;

            background:
                linear-gradient(
                    135deg,
                    #ffffff,
                    #f8fafc
                );
        }


        .tramos-header {

            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            gap:
                15px;
        }


        .tramos-header h3 {

            margin:
                2px 0 0;

            color:
                #172033;

            font-size:
                17px;
        }


        .tramos-mini {

            display:
                block;

            color:
                #687386;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1px;
        }


        .cantidad-tramos {

            padding:
                6px 10px;

            border-radius:
                20px;

            background:
                #eef3ff;

            color:
                #3563e9;

            font-size:
                11px;

            font-weight:
                800;

            white-space:
                nowrap;
        }


        .tramos-explicacion {

            margin:
                10px 0 13px;

            color:
                #687386;

            font-size:
                12px;

            line-height:
                1.5;
        }


        .lista-tramos {

            display:
                grid;

            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        150px,
                        1fr
                    )
                );

            gap:
                8px;
        }


        .tramo-item {

            display:
                flex;

            align-items:
                center;

            gap:
                9px;

            padding:
                10px;

            border:
                1px solid
                #e2e7ee;

            border-radius:
                9px;

            background:
                white;
        }


        .tramo-color {

            width:
                5px;

            min-height:
                35px;

            border-radius:
                20px;

            flex-shrink:
                0;
        }


        .tramo-item span {

            display:
                block;

            color:
                #7b8494;

            font-size:
                10px;

            text-transform:
                uppercase;

            font-weight:
                700;
        }


        .tramo-item strong {

            display:
                block;

            margin-top:
                3px;

            color:
                #273244;

            font-size:
                15px;

            font-family:
                Georgia,
                "Times New Roman",
                serif;
        }


        @media (
            max-width: 600px
        ) {

            .lista-tramos {

                grid-template-columns:
                    1fr;
            }
        }

        `;


    document.head.appendChild(
        estilos
    );
}


window.addEventListener(
    "DOMContentLoaded",
    crearGraficaInicial
);