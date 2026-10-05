/* ============================================================
   DIAGNÓSTICO MATEMÁTICO

   Este módulo analiza la información que ya devuelve
   el backend y presenta:

   - Tipo de intervalo
   - Extremos infinitos
   - Singularidades
   - Singularidades interiores
   - Singularidades en extremos
   - Estrategia recomendada
   - Clasificación final
   ============================================================ */


/* ============================================================
   INICIO
   ============================================================ */

function iniciarDiagnosticoMatematico() {

    crearEstilosDiagnostico();

    crearPanelDiagnostico();
}


/* ============================================================
   CREAR PANEL
   ============================================================ */

function crearPanelDiagnostico() {

    if (
        document.getElementById(
            "diagnosticoMatematico"
        )
    ) {

        return;
    }


    const resultadoContenido =
        document.getElementById(
            "resultadoContenido"
        );


    if (
        !resultadoContenido
    ) {

        return;
    }


    const integralPrincipal =
        resultadoContenido.querySelector(
            ".integral-principal"
        );


    if (
        !integralPrincipal
    ) {

        return;
    }


    const seccion =
        document.createElement(
            "section"
        );


    seccion.id =
        "diagnosticoMatematico";


    seccion.className =
        "diagnostico-matematico";


    seccion.innerHTML =
        `

        <div class="diagnostico-header">

            <div>

                <span class="diagnostico-mini">
                    ANÁLISIS PREVIO
                </span>

                <h3>
                    Diagnóstico matemático
                </h3>

                <p>
                    Identificación automática de las
                    características del problema.
                </p>

            </div>


            <span
                id="badgeDiagnostico"
                class="badge-diagnostico"
            >
                ANALIZANDO
            </span>

        </div>


        <div
            id="diagnosticoGrid"
            class="diagnostico-grid"
        >
        </div>


        <div class="estrategia-diagnostico">

            <div class="estrategia-titulo">

                <div class="estrategia-icono">
                    ∫
                </div>

                <div>

                    <span>
                        Estrategia recomendada
                    </span>

                    <strong
                        id="tituloEstrategia"
                    >
                    </strong>

                </div>

            </div>


            <p
                id="textoEstrategia"
                class="texto-estrategia"
            >
            </p>


            <math-field
                id="formulaEstrategia"
                read-only
                class="formula-estrategia"
            ></math-field>

        </div>


        <div
            id="advertenciaDiagnostico"
            class="advertencia-diagnostico oculto"
        >
        </div>

        `;


    integralPrincipal
        .insertAdjacentElement(
            "beforebegin",
            seccion
        );
}


/* ============================================================
   CONVERTIR VALOR SIMBÓLICO A NÚMERO
   ============================================================ */

function numeroDiagnostico(
    valor
) {

    if (
        valor === null
        ||
        valor === undefined
    ) {

        return NaN;
    }


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

        const numero =
            Number(
                math.evaluate(
                    texto
                )
            );


        return numero;


    } catch {

        return NaN;
    }
}


/* ============================================================
   COMPARACIÓN NUMÉRICA
   ============================================================ */

function numerosIgualesDiagnostico(
    a,
    b
) {

    if (
        !Number.isFinite(a)
        ||
        !Number.isFinite(b)
    ) {

        return false;
    }


    return (
        Math.abs(
            a - b
        )
        <
        0.000001
    );
}


/* ============================================================
   ANALIZAR SINGULARIDADES
   ============================================================ */

function analizarSingularidadesDiagnostico(
    datos
) {

    const inferior =
        numeroDiagnostico(
            datos.limite_inferior
        );


    const superior =
        numeroDiagnostico(
            datos.limite_superior
        );


    const singularidades =
        (
            datos.singularidades
            ||
            []
        );


    const resultado = {

        todas:
            singularidades,

        interiores:
            [],

        extremoInferior:
            [],

        extremoSuperior:
            []
    };


    singularidades.forEach(
        singularidad => {

            const punto =
                numeroDiagnostico(
                    singularidad
                );


            if (
                !Number.isFinite(
                    punto
                )
            ) {

                return;
            }


            if (
                numerosIgualesDiagnostico(
                    punto,
                    inferior
                )
            ) {

                resultado
                    .extremoInferior
                    .push(
                        singularidad
                    );


                return;
            }


            if (
                numerosIgualesDiagnostico(
                    punto,
                    superior
                )
            ) {

                resultado
                    .extremoSuperior
                    .push(
                        singularidad
                    );


                return;
            }


            const despuesInferior =

                inferior === -Infinity

                ||

                punto > inferior;


            const antesSuperior =

                superior === Infinity

                ||

                punto < superior;


            if (
                despuesInferior
                &&
                antesSuperior
            ) {

                resultado
                    .interiores
                    .push(
                        singularidad
                    );
            }

        }
    );


    return resultado;
}


/* ============================================================
   CREAR TARJETA
   ============================================================ */

function crearTarjetaDiagnostico(
    titulo,
    valor,
    estado = "neutral"
) {

    return `
        <article
            class="
                diagnostico-item
                diagnostico-${estado}
            "
        >

            <span>
                ${titulo}
            </span>

            <strong>
                ${valor}
            </strong>

        </article>
    `;
}


/* ============================================================
   GENERAR DIAGNÓSTICO
   ============================================================ */

function generarDiagnostico(
    datos
) {

    const inferior =
        numeroDiagnostico(
            datos.limite_inferior
        );


    const superior =
        numeroDiagnostico(
            datos.limite_superior
        );


    const infinitoInferior =
        inferior === -Infinity;


    const infinitoSuperior =
        superior === Infinity;


    const singularidades =
        analizarSingularidadesDiagnostico(
            datos
        );


    const cantidadSingularidades =
        singularidades
            .todas
            .length;


    const cantidadInteriores =
        singularidades
            .interiores
            .length;


    const singularidadInferior =
        singularidades
            .extremoInferior
            .length
            >
            0;


    const singularidadSuperior =
        singularidades
            .extremoSuperior
            .length
            >
            0;


    let intervalo =
        "Acotado";


    if (
        infinitoInferior
        &&
        infinitoSuperior
    ) {

        intervalo =
            "No acotado en ambos extremos";

    } else if (
        infinitoSuperior
    ) {

        intervalo =
            "No acotado hacia +∞";

    } else if (
        infinitoInferior
    ) {

        intervalo =
            "No acotado hacia -∞";
    }


    let extremoProblematico =
        "Ninguno";


    if (
        infinitoInferior
        &&
        infinitoSuperior
    ) {

        extremoProblematico =
            "−∞ y +∞";

    } else if (
        infinitoSuperior
    ) {

        extremoProblematico =
            "+∞";

    } else if (
        infinitoInferior
    ) {

        extremoProblematico =
            "−∞";

    } else if (
        singularidadInferior
        &&
        singularidadSuperior
    ) {

        extremoProblematico =
            "Ambos extremos";

    } else if (
        singularidadInferior
    ) {

        extremoProblematico =
            "Límite inferior";

    } else if (
        singularidadSuperior
    ) {

        extremoProblematico =
            "Límite superior";
    }


    return {

        inferior:
            inferior,

        superior:
            superior,

        infinitoInferior:
            infinitoInferior,

        infinitoSuperior:
            infinitoSuperior,

        intervalo:
            intervalo,

        singularidades:
            singularidades,

        cantidadSingularidades:
            cantidadSingularidades,

        cantidadInteriores:
            cantidadInteriores,

        singularidadInferior:
            singularidadInferior,

        singularidadSuperior:
            singularidadSuperior,

        extremoProblematico:
            extremoProblematico
    };
}


/* ============================================================
   MÉTODO RECOMENDADO
   ============================================================ */

function generarEstrategia(
    datos,
    diagnostico
) {

    const funcion =
        datos.funcion_latex
        ||
        "f(x)";


    const inferiorLatex =
        convertirLimiteALatex(
            datos.limite_inferior
        );


    const superiorLatex =
        convertirLimiteALatex(
            datos.limite_superior
        );


    const interiores =
        diagnostico
            .singularidades
            .interiores;


    /* ========================================================
       INFINITO EN AMBOS EXTREMOS
       ======================================================== */

    if (
        diagnostico.infinitoInferior
        &&
        diagnostico.infinitoSuperior
        &&
        diagnostico.cantidadSingularidades
        ===
        0
    ) {

        return {

            titulo:
                "Dividir la integral y evaluar dos límites",

            texto:
                (
                    "Como el intervalo se extiende desde menos "
                    +
                    "infinito hasta más infinito, se elige un "
                    +
                    "punto finito c y se estudian por separado "
                    +
                    "las dos integrales impropias."
                ),

            formula:

                "\\lim_{a\\to-\\infty}"
                +
                "\\int_{a}^{c}"
                +
                funcion
                +
                "\\,dx"
                +
                "+"
                +
                "\\lim_{b\\to\\infty}"
                +
                "\\int_{c}^{b}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       INFINITO + SINGULARIDADES
       ======================================================== */

    if (
        (
            diagnostico.infinitoInferior
            ||
            diagnostico.infinitoSuperior
        )
        &&
        diagnostico.cantidadSingularidades
        >
        0
    ) {

        return {

            titulo:
                "Dividir en los puntos problemáticos y aplicar límites",

            texto:
                (
                    "Este es un caso mixto. El intervalo contiene "
                    +
                    "un extremo infinito y además existen puntos "
                    +
                    "donde la función no está definida. Cada tramo "
                    +
                    "debe analizarse por separado."
                ),

            formula:

                "\\text{Dividir en }"
                +
                diagnostico
                    .singularidades
                    .todas
                    .join(",\\;")
                +
                "\\text{ y evaluar cada límite}"
        };
    }


    /* ========================================================
       + INFINITO
       ======================================================== */

    if (
        diagnostico.infinitoSuperior
    ) {

        return {

            titulo:
                "Sustituir +∞ por un límite variable",

            texto:
                (
                    "Se reemplaza el límite superior infinito "
                    +
                    "por una variable b y luego se evalúa el "
                    +
                    "límite cuando b tiende a infinito."
                ),

            formula:

                "\\lim_{b\\to\\infty}"
                +
                "\\int_{"
                +
                inferiorLatex
                +
                "}^{b}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       - INFINITO
       ======================================================== */

    if (
        diagnostico.infinitoInferior
    ) {

        return {

            titulo:
                "Sustituir −∞ por un límite variable",

            texto:
                (
                    "Se reemplaza el extremo inferior por una "
                    +
                    "variable a y se estudia el límite cuando "
                    +
                    "a tiende a menos infinito."
                ),

            formula:

                "\\lim_{a\\to-\\infty}"
                +
                "\\int_{a}^{"
                +
                superiorLatex
                +
                "}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       VARIAS SINGULARIDADES INTERIORES
       ======================================================== */

    if (
        interiores.length
        >
        1
    ) {

        return {

            titulo:
                "Dividir la integral en varios intervalos",

            texto:
                (
                    "Existen varias discontinuidades dentro del "
                    +
                    "intervalo. La integral debe separarse en cada "
                    +
                    "uno de esos puntos y cada parte debe converger."
                ),

            formula:

                "\\text{Separar en }x="
                +
                interiores.join(
                    ",\\;"
                )
                +
                "\\text{ y evaluar límites laterales}"
        };
    }


    /* ========================================================
       UNA SINGULARIDAD INTERIOR
       ======================================================== */

    if (
        interiores.length
        ===
        1
    ) {

        const c =
            interiores[0];


        return {

            titulo:
                "Dividir en la discontinuidad",

            texto:
                (
                    "La función presenta una discontinuidad dentro "
                    +
                    "del intervalo. Deben evaluarse independientemente "
                    +
                    "los límites por izquierda y por derecha."
                ),

            formula:

                "\\lim_{t\\to "
                +
                c
                +
                "^-}"
                +
                "\\int_{"
                +
                inferiorLatex
                +
                "}^{t}"
                +
                funcion
                +
                "\\,dx"
                +
                "+"
                +
                "\\lim_{s\\to "
                +
                c
                +
                "^+}"
                +
                "\\int_{s}^{"
                +
                superiorLatex
                +
                "}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       SINGULARIDAD EN AMBOS EXTREMOS
       ======================================================== */

    if (
        diagnostico.singularidadInferior
        &&
        diagnostico.singularidadSuperior
    ) {

        return {

            titulo:
                "Aplicar límites laterales en ambos extremos",

            texto:
                (
                    "La función presenta problemas tanto en el "
                    +
                    "límite inferior como en el superior. Se debe "
                    +
                    "dividir el intervalo en un punto interior."
                ),

            formula:

                "\\lim_{t\\to "
                +
                inferiorLatex
                +
                "^+}"
                +
                "\\int_{t}^{c}"
                +
                funcion
                +
                "\\,dx"
                +
                "+"
                +
                "\\lim_{s\\to "
                +
                superiorLatex
                +
                "^-}"
                +
                "\\int_{c}^{s}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       SINGULARIDAD EN LÍMITE INFERIOR
       ======================================================== */

    if (
        diagnostico.singularidadInferior
    ) {

        return {

            titulo:
                "Aplicar límite lateral por la derecha",

            texto:
                (
                    "La función no está definida en el límite "
                    +
                    "inferior. La integral empieza ligeramente "
                    +
                    "a la derecha y luego se toma el límite."
                ),

            formula:

                "\\lim_{t\\to "
                +
                inferiorLatex
                +
                "^+}"
                +
                "\\int_{t}^{"
                +
                superiorLatex
                +
                "}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       SINGULARIDAD EN LÍMITE SUPERIOR
       ======================================================== */

    if (
        diagnostico.singularidadSuperior
    ) {

        return {

            titulo:
                "Aplicar límite lateral por la izquierda",

            texto:
                (
                    "La función presenta una discontinuidad en "
                    +
                    "el límite superior. La integración se detiene "
                    +
                    "antes del punto y luego se evalúa el límite."
                ),

            formula:

                "\\lim_{t\\to "
                +
                superiorLatex
                +
                "^-}"
                +
                "\\int_{"
                +
                inferiorLatex
                +
                "}^{t}"
                +
                funcion
                +
                "\\,dx"
        };
    }


    /* ========================================================
       INTEGRAL PROPIA
       ======================================================== */

    return {

        titulo:
            "Evaluación directa",

        texto:
            (
                "No se detectaron límites infinitos ni "
                +
                "discontinuidades dentro del intervalo. "
                +
                "La integral puede evaluarse directamente."
            ),

        formula:

            "\\int_{"
            +
            inferiorLatex
            +
            "}^{"
            +
            superiorLatex
            +
            "}"
            +
            funcion
            +
            "\\,dx"
    };
}


/* ============================================================
   LÍMITE A LATEX
   ============================================================ */

function convertirLimiteALatex(
    valor
) {

    const texto =
        String(
            valor
        );


    if (
        texto === "oo"
        ||
        texto === "inf"
    ) {

        return "\\infty";
    }


    if (
        texto === "-oo"
        ||
        texto === "-inf"
    ) {

        return "-\\infty";
    }


    return texto;
}


/* ============================================================
   MOSTRAR DIAGNÓSTICO
   ============================================================ */

function mostrarDiagnosticoIntegral(
    datos
) {

    crearPanelDiagnostico();


    const diagnostico =
        generarDiagnostico(
            datos
        );


    const estrategia =
        generarEstrategia(
            datos,
            diagnostico
        );


    const grid =
        document.getElementById(
            "diagnosticoGrid"
        );


    const badge =
        document.getElementById(
            "badgeDiagnostico"
        );


    const tituloEstrategia =
        document.getElementById(
            "tituloEstrategia"
        );


    const textoEstrategia =
        document.getElementById(
            "textoEstrategia"
        );


    const formulaEstrategia =
        document.getElementById(
            "formulaEstrategia"
        );


    const advertencia =
        document.getElementById(
            "advertenciaDiagnostico"
        );


    /* ========================================================
       INTERVALO
       ======================================================== */

    let estadoIntervalo =
        "bien";


    if (
        diagnostico.infinitoInferior
        ||
        diagnostico.infinitoSuperior
    ) {

        estadoIntervalo =
            "atencion";
    }


    /* ========================================================
       SINGULARIDADES
       ======================================================== */

    const textoSingularidades =

        diagnostico.cantidadSingularidades
        ===
        0

        ?

        "Ninguna"

        :

        diagnostico.cantidadSingularidades
        +
        (
            diagnostico.cantidadSingularidades
            ===
            1

            ?

            " punto"

            :

            " puntos"
        );


    /* ========================================================
       INTERIORES
       ======================================================== */

    const textoInteriores =

        diagnostico.cantidadInteriores
        ===
        0

        ?

        "No"

        :

        (
            "Sí — "
            +
            diagnostico
                .singularidades
                .interiores
                .join(
                    ", "
                )
        );


    /* ========================================================
       CARDS
       ======================================================== */

    grid.innerHTML =

        crearTarjetaDiagnostico(
            "Intervalo",
            diagnostico.intervalo,
            estadoIntervalo
        )

        +

        crearTarjetaDiagnostico(
            "Singularidades",
            textoSingularidades,
            diagnostico.cantidadSingularidades
            >
            0
            ?
            "atencion"
            :
            "bien"
        )

        +

        crearTarjetaDiagnostico(
            "Discontinuidad interior",
            textoInteriores,
            diagnostico.cantidadInteriores
            >
            0
            ?
            "peligro"
            :
            "bien"
        )

        +

        crearTarjetaDiagnostico(
            "Extremo problemático",
            diagnostico.extremoProblematico,
            diagnostico.extremoProblematico
            ===
            "Ninguno"
            ?
            "bien"
            :
            "atencion"
        );


    /* ========================================================
       BADGE
       ======================================================== */

    const clasificacion =
        datos.clasificacion
        ||
        "indeterminado";


    badge.textContent =
        clasificacion.toUpperCase();


    badge.className =
        "badge-diagnostico "
        +
        "badge-"
        +
        clasificacion;


    /* ========================================================
       ESTRATEGIA
       ======================================================== */

    tituloEstrategia.textContent =
        estrategia.titulo;


    textoEstrategia.textContent =
        estrategia.texto;


    formulaEstrategia.value =
        estrategia.formula;


    /* ========================================================
       ADVERTENCIA
       ======================================================== */

    advertencia.classList.add(
        "oculto"
    );


    if (
        diagnostico.cantidadInteriores
        >
        0
    ) {

        advertencia.textContent =
            (
                "Importante: una integral con una discontinuidad "
                +
                "interior solo converge si todas las integrales "
                +
                "obtenidas al dividir el intervalo convergen."
            );


        advertencia.classList.remove(
            "oculto"
        );
    }


    if (
        diagnostico.infinitoInferior
        &&
        diagnostico.infinitoSuperior
    ) {

        advertencia.textContent =
            (
                "Importante: no debe evaluarse directamente "
                +
                "desde −∞ hasta +∞ como un solo límite. "
                +
                "Las dos partes deben converger de manera independiente."
            );


        advertencia.classList.remove(
            "oculto"
        );
    }
}


/* ============================================================
   EXPORTAR
   ============================================================ */

window.mostrarDiagnosticoIntegral =
    mostrarDiagnosticoIntegral;


/* ============================================================
   ESTILOS
   ============================================================ */

function crearEstilosDiagnostico() {

    if (
        document.getElementById(
            "estilosDiagnosticoMatematico"
        )
    ) {

        return;
    }


    const estilos =
        document.createElement(
            "style"
        );


    estilos.id =
        "estilosDiagnosticoMatematico";


    estilos.textContent =
        `

        .diagnostico-matematico {

            margin:
                20px 0;

            padding:
                20px;

            border:
                1px solid
                #d7e1ef;

            border-radius:
                14px;

            background:
                linear-gradient(
                    135deg,
                    #ffffff,
                    #f8fbff
                );
        }


        .diagnostico-header {

            display:
                flex;

            align-items:
                flex-start;

            justify-content:
                space-between;

            gap:
                20px;

            margin-bottom:
                17px;
        }


        .diagnostico-mini {

            display:
                block;

            margin-bottom:
                4px;

            color:
                #3563e9;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1.2px;
        }


        .diagnostico-header h3 {

            margin:
                0;

            font-size:
                21px;

            color:
                #172033;
        }


        .diagnostico-header p {

            margin:
                5px 0 0;

            color:
                #687386;

            font-size:
                13px;
        }


        .badge-diagnostico {

            padding:
                8px 13px;

            border-radius:
                30px;

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                0.4px;
        }


        .badge-convergente {

            color:
                #118653;

            background:
                #e8f8f0;
        }


        .badge-divergente {

            color:
                #c83d4b;

            background:
                #fff0f2;
        }


        .badge-indeterminado {

            color:
                #946200;

            background:
                #fff8df;
        }


        .diagnostico-grid {

            display:
                grid;

            grid-template-columns:
                repeat(
                    4,
                    minmax(
                        0,
                        1fr
                    )
                );

            gap:
                10px;
        }


        .diagnostico-item {

            min-height:
                92px;

            padding:
                13px;

            border-radius:
                10px;

            border:
                1px solid
                #e0e6ef;

            background:
                white;
        }


        .diagnostico-item span {

            display:
                block;

            margin-bottom:
                7px;

            color:
                #7a8595;

            font-size:
                10px;

            font-weight:
                700;

            text-transform:
                uppercase;

            letter-spacing:
                0.5px;
        }


        .diagnostico-item strong {

            color:
                #283244;

            font-size:
                14px;

            line-height:
                1.35;
        }


        .diagnostico-bien {

            border-top:
                3px solid
                #2aa76c;
        }


        .diagnostico-atencion {

            border-top:
                3px solid
                #e4a82e;
        }


        .diagnostico-peligro {

            border-top:
                3px solid
                #d5515d;
        }


        .estrategia-diagnostico {

            margin-top:
                14px;

            padding:
                16px;

            border:
                1px solid
                #d9e4f4;

            border-radius:
                11px;

            background:
                #f9fbff;
        }


        .estrategia-titulo {

            display:
                flex;

            align-items:
                center;

            gap:
                11px;
        }


        .estrategia-icono {

            width:
                39px;

            height:
                39px;

            display:
                grid;

            place-items:
                center;

            flex-shrink:
                0;

            border-radius:
                10px;

            background:
                #eef3ff;

            color:
                #3563e9;

            font-family:
                Georgia,
                serif;

            font-size:
                25px;
        }


        .estrategia-titulo span {

            display:
                block;

            color:
                #7b8494;

            font-size:
                10px;

            font-weight:
                700;

            text-transform:
                uppercase;

            letter-spacing:
                0.5px;
        }


        .estrategia-titulo strong {

            display:
                block;

            margin-top:
                3px;

            color:
                #172033;

            font-size:
                15px;
        }


        .texto-estrategia {

            margin:
                13px 0;

            color:
                #5b687b;

            font-size:
                13px;

            line-height:
                1.55;
        }


        .formula-estrategia {

            display:
                block;

            width:
                100%;

            padding:
                11px 13px;

            border:
                1px solid
                #e1e7f0;

            border-radius:
                9px;

            background:
                white;

            font-size:
                24px;

            overflow-x:
                auto;
        }


        .advertencia-diagnostico {

            margin-top:
                13px;

            padding:
                11px 13px;

            border-left:
                4px solid
                #e4a82e;

            border-radius:
                0 8px 8px 0;

            background:
                #fff9e9;

            color:
                #756126;

            font-size:
                12px;

            line-height:
                1.5;
        }


        @media (
            max-width: 1000px
        ) {

            .diagnostico-grid {

                grid-template-columns:
                    repeat(
                        2,
                        1fr
                    );
            }

        }


        @media (
            max-width: 600px
        ) {

            .diagnostico-grid {

                grid-template-columns:
                    1fr;
            }


            .diagnostico-header {

                flex-direction:
                    column;
            }

        }

        `;


    document.head.appendChild(
        estilos
    );
}


/* ============================================================
   EJECUCIÓN
   ============================================================ */

iniciarDiagnosticoMatematico();