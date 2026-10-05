let panelAnalisisTramosCreado =
    false;


function iniciarAnalisisTramos() {

    crearEstilosAnalisisTramos();

    crearPanelAnalisisTramos();
}


function crearPanelAnalisisTramos() {

    if (
        document.getElementById(
            "analisisTramosDetallado"
        )
    ) {

        panelAnalisisTramosCreado =
            true;


        return;
    }


    const procedimiento =
        document.querySelector(
            ".procedimiento-contenedor"
        );


    if (
        !procedimiento
    ) {

        return;
    }


    const panel =
        document.createElement(
            "section"
        );


    panel.id =
        "analisisTramosDetallado";


    panel.className =
        "analisis-tramos-detallado oculto";


    panel.innerHTML =
        `
        <div class="timeline-header">

            <div>

                <span class="timeline-mini">
                    ANÁLISIS DETALLADO
                </span>

                <h3>
                    Línea de tiempo por tramos
                </h3>

                <p>
                    Cada región de la integral impropia
                    se evalúa de forma independiente.
                </p>

            </div>

            <span
                id="contadorTimelineTramos"
                class="contador-timeline"
            >
            </span>

        </div>


        <div
            id="timelineTramos"
            class="timeline-tramos"
        >
        </div>


        <div
            id="conclusionTimeline"
            class="conclusion-timeline"
        >
        </div>
        `;


    procedimiento.insertAdjacentElement(
        "beforebegin",
        panel
    );


    panelAnalisisTramosCreado =
        true;
}


function normalizarExtremoTramo(
    valor
) {

    const texto =
        String(
            valor
        )
        .trim();


    if (
        texto === "inf"
        ||
        texto === "oo"
        ||
        texto === "Infinity"
    ) {

        return "∞";
    }


    if (
        texto === "-inf"
        ||
        texto === "-oo"
        ||
        texto === "-Infinity"
    ) {

        return "−∞";
    }


    return texto;
}


function convertirNumeroTramo(
    valor
) {

    const texto =
        String(
            valor
        )
        .trim();


    if (
        texto === "inf"
        ||
        texto === "oo"
        ||
        texto === "Infinity"
    ) {

        return Infinity;
    }


    if (
        texto === "-inf"
        ||
        texto === "-oo"
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


        return Number(
            resultado
        );

    } catch {

        return NaN;
    }
}


function mismaPosicionTramo(
    a,
    b
) {

    const numeroA =
        convertirNumeroTramo(
            a
        );


    const numeroB =
        convertirNumeroTramo(
            b
        );


    if (
        Number.isFinite(
            numeroA
        )
        &&
        Number.isFinite(
            numeroB
        )
    ) {

        return (
            Math.abs(
                numeroA
                -
                numeroB
            )
            <
            0.000001
        );
    }


    return (
        String(
            a
        ).trim()
        ===
        String(
            b
        ).trim()
    );
}


function extremoEsSingular(
    extremo,
    singularidades
) {

    return (
        singularidades
        ||
        []
    ).some(
        singularidad =>
            mismaPosicionTramo(
                extremo,
                singularidad
            )
    );
}


function crearTextoIntervalo(
    parte,
    singularidades
) {

    const desde =
        parte.desde;


    const hasta =
        parte.hasta;


    const desdeNumero =
        convertirNumeroTramo(
            desde
        );


    const hastaNumero =
        convertirNumeroTramo(
            hasta
        );


    const abiertoIzquierda =

        desdeNumero === -Infinity

        ||

        extremoEsSingular(
            desde,
            singularidades
        );


    const abiertoDerecha =

        hastaNumero === Infinity

        ||

        extremoEsSingular(
            hasta,
            singularidades
        );


    const izquierdo =
        abiertoIzquierda
        ?
        "("
        :
        "[";


    const derecho =
        abiertoDerecha
        ?
        ")"
        :
        "]";


    return (
        izquierdo
        +
        normalizarExtremoTramo(
            desde
        )
        +
        ", "
        +
        normalizarExtremoTramo(
            hasta
        )
        +
        derecho
    );
}


function textoMetodoTramo(
    metodo
) {

    if (
        metodo
        ===
        "integracion_directa"
    ) {

        return "Evaluación simbólica";
    }


    if (
        metodo
        ===
        "limite_antiderivada"
    ) {

        return "Límite de la antiderivada";
    }


    if (
        metodo
        ===
        "sin_antiderivada"
    ) {

        return "Sin antiderivada explícita";
    }


    if (
        metodo
        ===
        "fallo_simbolico"
    ) {

        return "Análisis simbólico";
    }


    return "Método automático";
}


function descripcionEstadoTramo(
    estado
) {

    if (
        estado
        ===
        "convergente"
    ) {

        return (
            "Este tramo produce un valor finito, "
            +
            "por lo que supera individualmente "
            +
            "la prueba de convergencia."
        );
    }


    if (
        estado
        ===
        "divergente"
    ) {

        return (
            "Este tramo no produce un valor finito. "
            +
            "Por sí solo es suficiente para que "
            +
            "la integral impropia completa diverja."
        );
    }


    return (
        "El motor no pudo determinar con seguridad "
        +
        "el comportamiento de este tramo."
    );
}


function crearTarjetaTimeline(
    parte,
    indice,
    datos,
    esUltimo
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    const estado =
        parte.estado
        ||
        "indeterminado";


    tarjeta.className =
        (
            "timeline-item "
            +
            "timeline-"
            +
            estado
        );


    const intervalo =
        crearTextoIntervalo(
            parte,
            datos.singularidades
            ||
            []
        );


    tarjeta.innerHTML =
        `
        <div class="timeline-columna">

            <div
                class="
                    timeline-punto
                    punto-${estado}
                "
            >
                ${indice + 1}
            </div>

            ${
                esUltimo
                ?
                ""
                :
                '<span class="timeline-linea"></span>'
            }

        </div>


        <div class="timeline-contenido">

            <div class="timeline-item-header">

                <div>

                    <span class="timeline-tramo-label">
                        TRAMO ${indice + 1}
                    </span>

                    <h4>
                        ${intervalo}
                    </h4>

                </div>


                <span
                    class="
                        estado-tramo
                        estado-${estado}
                    "
                >
                    ${estado.toUpperCase()}
                </span>

            </div>


            <div class="timeline-metodo">

                <span>
                    Método
                </span>

                <strong>
                    ${textoMetodoTramo(
                        parte.metodo
                    )}
                </strong>

            </div>


            <p class="timeline-descripcion">

                ${descripcionEstadoTramo(
                    estado
                )}

            </p>


            <div class="timeline-formula">

                <span>
                    Definición impropia
                </span>

                <math-field
                    read-only
                    class="formula-tramo"
                ></math-field>

            </div>


            <div class="timeline-formula resultado-formula-tramo">

                <span>
                    Evaluación
                </span>

                <math-field
                    read-only
                    class="formula-evaluacion-tramo"
                ></math-field>

            </div>

        </div>
        `;


    const campoDefinicion =
        tarjeta.querySelector(
            ".formula-tramo"
        );


    const campoEvaluacion =
        tarjeta.querySelector(
            ".formula-evaluacion-tramo"
        );


    campoDefinicion.value =
        parte.definicion_latex
        ||
        "";


    campoEvaluacion.value =
        parte.evaluacion_latex
        ||
        "";


    return tarjeta;
}


function mostrarConclusionTimeline(
    datos
) {

    const contenedor =
        document.getElementById(
            "conclusionTimeline"
        );


    if (
        !contenedor
    ) {

        return;
    }


    const estado =
        datos.clasificacion
        ||
        "indeterminado";


    let titulo;
    let texto;
    let formula;


    if (
        estado === "convergente"
    ) {

        titulo =
            "Todos los tramos convergen";


        texto =
            (
                "Como cada parte posee un valor finito, "
                +
                "la integral impropia completa es convergente."
            );


        formula =
            (
                datos.resultado_latex
                ?
                "\\boxed{"
                +
                datos.resultado_latex
                +
                "}"
                :
                "\\boxed{\\text{Convergente}}"
            );

    } else if (
        estado === "divergente"
    ) {

        titulo =
            "La integral completa diverge";


        texto =
            (
                "Basta con que uno de los tramos no converja "
                +
                "para que la integral impropia completa "
                +
                "sea divergente."
            );


        formula =
            "\\boxed{\\text{Divergente}}";

    } else {

        titulo =
            "Resultado no determinado";


        texto =
            (
                "Al menos uno de los tramos no pudo "
                +
                "clasificarse de forma segura."
            );


        formula =
            "\\boxed{\\text{Indeterminado}}";
    }


    contenedor.className =
        (
            "conclusion-timeline "
            +
            "conclusion-"
            +
            estado
        );


    contenedor.innerHTML =
        `
        <div>

            <span class="conclusion-mini">
                CONCLUSIÓN GENERAL
            </span>

            <h4>
                ${titulo}
            </h4>

            <p>
                ${texto}
            </p>

        </div>

        <math-field
            id="formulaConclusionTimeline"
            read-only
            class="formula-conclusion-timeline"
        ></math-field>
        `;


    document
        .getElementById(
            "formulaConclusionTimeline"
        )
        .value =
            formula;
}


function mostrarAnalisisTramos(
    datos
) {

    crearPanelAnalisisTramos();


    const panel =
        document.getElementById(
            "analisisTramosDetallado"
        );


    const timeline =
        document.getElementById(
            "timelineTramos"
        );


    const contador =
        document.getElementById(
            "contadorTimelineTramos"
        );


    if (
        !panel
        ||
        !timeline
        ||
        !contador
    ) {

        return;
    }


    const partes =
        datos.partes
        ||
        [];


    if (
        partes.length === 0
    ) {

        panel.classList.add(
            "oculto"
        );


        return;
    }


    const esIntegralPropia =
        datos.tipo
        ===
        "Integral propia";


    if (
        esIntegralPropia
        &&
        partes.length === 1
    ) {

        panel.classList.add(
            "oculto"
        );


        return;
    }


    panel.classList.remove(
        "oculto"
    );


    timeline.innerHTML =
        "";


    contador.textContent =
        partes.length
        +
        (
            partes.length === 1
            ?
            " tramo"
            :
            " tramos"
        );


    partes.forEach(
        (
            parte,
            indice
        ) => {

            const tarjeta =
                crearTarjetaTimeline(
                    parte,
                    indice,
                    datos,
                    indice
                    ===
                    partes.length - 1
                );


            timeline.appendChild(
                tarjeta
            );

        }
    );


    mostrarConclusionTimeline(
        datos
    );
}


window.mostrarAnalisisTramos =
    mostrarAnalisisTramos;


function crearEstilosAnalisisTramos() {

    if (
        document.getElementById(
            "estilosAnalisisTramos"
        )
    ) {

        return;
    }


    const estilos =
        document.createElement(
            "style"
        );


    estilos.id =
        "estilosAnalisisTramos";


    estilos.textContent =
        `

        .analisis-tramos-detallado {

            margin-top:
                24px;

            padding-top:
                22px;

            border-top:
                1px solid
                #dce3ec;
        }


        .timeline-header {

            display:
                flex;

            align-items:
                flex-start;

            justify-content:
                space-between;

            gap:
                20px;

            margin-bottom:
                22px;
        }


        .timeline-mini {

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
                1.1px;
        }


        .timeline-header h3 {

            margin:
                0;

            color:
                #172033;

            font-size:
                20px;
        }


        .timeline-header p {

            margin:
                5px 0 0;

            color:
                #687386;

            font-size:
                13px;
        }


        .contador-timeline {

            padding:
                7px 12px;

            border-radius:
                30px;

            background:
                #eef3ff;

            color:
                #3563e9;

            font-size:
                11px;

            font-weight:
                800;
        }


        .timeline-tramos {

            display:
                flex;

            flex-direction:
                column;
        }


        .timeline-item {

            display:
                grid;

            grid-template-columns:
                48px 1fr;

            gap:
                10px;
        }


        .timeline-columna {

            position:
                relative;

            display:
                flex;

            flex-direction:
                column;

            align-items:
                center;
        }


        .timeline-punto {

            position:
                relative;

            z-index:
                2;

            width:
                34px;

            height:
                34px;

            display:
                grid;

            place-items:
                center;

            flex-shrink:
                0;

            border-radius:
                50%;

            color:
                white;

            font-size:
                12px;

            font-weight:
                800;
        }


        .punto-convergente {

            background:
                #118653;
        }


        .punto-divergente {

            background:
                #c83d4b;
        }


        .punto-indeterminado {

            background:
                #b17a0e;
        }


        .timeline-linea {

            width:
                2px;

            flex:
                1;

            min-height:
                45px;

            background:
                #dce3ec;
        }


        .timeline-contenido {

            margin-bottom:
                18px;

            padding:
                17px;

            border:
                1px solid
                #dce3ec;

            border-radius:
                13px;

            background:
                white;
        }


        .timeline-convergente
        .timeline-contenido {

            border-left:
                4px solid
                #118653;
        }


        .timeline-divergente
        .timeline-contenido {

            border-left:
                4px solid
                #c83d4b;
        }


        .timeline-indeterminado
        .timeline-contenido {

            border-left:
                4px solid
                #b17a0e;
        }


        .timeline-item-header {

            display:
                flex;

            align-items:
                flex-start;

            justify-content:
                space-between;

            gap:
                15px;
        }


        .timeline-tramo-label {

            display:
                block;

            color:
                #7b8494;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                0.7px;
        }


        .timeline-item-header h4 {

            margin:
                3px 0 0;

            color:
                #172033;

            font-family:
                Georgia,
                "Times New Roman",
                serif;

            font-size:
                19px;
        }


        .estado-tramo {

            padding:
                6px 10px;

            border-radius:
                30px;

            font-size:
                10px;

            font-weight:
                800;
        }


        .estado-convergente {

            color:
                #118653;

            background:
                #ecf9f2;
        }


        .estado-divergente {

            color:
                #c83d4b;

            background:
                #fff0f2;
        }


        .estado-indeterminado {

            color:
                #946200;

            background:
                #fff8df;
        }


        .timeline-metodo {

            display:
                flex;

            align-items:
                center;

            gap:
                7px;

            margin-top:
                12px;

            font-size:
                12px;
        }


        .timeline-metodo span {

            color:
                #7b8494;
        }


        .timeline-metodo strong {

            color:
                #344054;
        }


        .timeline-descripcion {

            margin:
                10px 0 14px;

            color:
                #687386;

            font-size:
                13px;

            line-height:
                1.5;
        }


        .timeline-formula {

            margin-top:
                9px;
        }


        .timeline-formula > span {

            display:
                block;

            margin-bottom:
                5px;

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


        .formula-tramo,
        .formula-evaluacion-tramo {

            display:
                block;

            width:
                100%;

            padding:
                10px 12px;

            border:
                1px solid
                #e1e7ef;

            border-radius:
                9px;

            background:
                #f8fafc;

            font-size:
                22px;

            overflow-x:
                auto;
        }


        .resultado-formula-tramo {

            margin-top:
                10px;
        }


        .conclusion-timeline {

            margin-top:
                4px;

            padding:
                18px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            gap:
                20px;

            border-radius:
                13px;
        }


        .conclusion-convergente {

            border:
                1px solid
                #ccebdc;

            background:
                #f3fbf7;
        }


        .conclusion-divergente {

            border:
                1px solid
                #ffd4da;

            background:
                #fff6f7;
        }


        .conclusion-indeterminado {

            border:
                1px solid
                #f1dfab;

            background:
                #fffaf0;
        }


        .conclusion-mini {

            display:
                block;

            color:
                #7b8494;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                0.7px;
        }


        .conclusion-timeline h4 {

            margin:
                4px 0 5px;

            font-size:
                17px;
        }


        .conclusion-timeline p {

            margin:
                0;

            max-width:
                720px;

            color:
                #687386;

            font-size:
                12px;

            line-height:
                1.5;
        }


        .formula-conclusion-timeline {

            min-width:
                180px;

            padding:
                10px;

            border:
                none;

            background:
                transparent;

            font-size:
                26px;

            text-align:
                center;
        }


        @media (
            max-width: 700px
        ) {

            .timeline-item {

                grid-template-columns:
                    38px 1fr;
            }


            .conclusion-timeline {

                flex-direction:
                    column;

                align-items:
                    stretch;
            }


            .formula-conclusion-timeline {

                width:
                    100%;
            }

        }

        `;


    document.head.appendChild(
        estilos
    );
}


iniciarAnalisisTramos();
