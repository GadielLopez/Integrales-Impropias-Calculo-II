const API =
    "http://127.0.0.1:8000";


let campoFuncionGlobal =
    null;


let campoInferiorGlobal =
    null;


let campoSuperiorGlobal =
    null;


let botonResolverGlobal =
    null;


let resolviendoDesdeGrafica =
    false;


window.addEventListener(
    "DOMContentLoaded",
    () => {

        campoFuncionGlobal =
            document.getElementById(
                "campoFuncion"
            );


        campoInferiorGlobal =
            document.getElementById(
                "limiteInferior"
            );


        campoSuperiorGlobal =
            document.getElementById(
                "limiteSuperior"
            );


        botonResolverGlobal =
            document.getElementById(
                "btnResolver"
            );


        campoFuncionGlobal
            .mathVirtualKeyboardPolicy =
                "manual";


        campoInferiorGlobal
            .mathVirtualKeyboardPolicy =
                "manual";


        campoSuperiorGlobal
            .mathVirtualKeyboardPolicy =
                "manual";


        configurarPestanas();


        configurarTeclado(
            campoFuncionGlobal
        );


        configurarEjemplos(
            campoFuncionGlobal,
            campoInferiorGlobal,
            campoSuperiorGlobal
        );


        botonResolverGlobal
            .addEventListener(
                "click",
                async () => {

                    await resolverIntegral(
                        campoFuncionGlobal,
                        campoInferiorGlobal,
                        campoSuperiorGlobal,
                        botonResolverGlobal
                    );

                }
            );


        cargarScriptUnaVez(
            "js/modos.js",
            "sistema-modos"
        );


        cargarScriptUnaVez(
            "js/diagnostico.js",
            "diagnostico-matematico"
        );


        cargarScriptUnaVez(
            "js/analisis_tramos.js",
            "analisis-tramos"
        );

    }
);


function cargarScriptUnaVez(
    ruta,
    identificador
) {

    if (
        document.querySelector(
            `script[data-modulo="${identificador}"]`
        )
    ) {

        return;
    }


    const script =
        document.createElement(
            "script"
        );


    script.src =
        ruta;


    script.dataset.modulo =
        identificador;


    script.onerror =
        () => {

            console.error(
                "No se pudo cargar:",
                ruta
            );

        };


    document.body.appendChild(
        script
    );
}


function configurarPestanas() {

    document
        .querySelectorAll(
            ".tab-modo"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        if (
                            boton.dataset.vista
                            ===
                            "constructor"
                            &&
                            typeof
                                window.obtenerModoHerramientas
                            ===
                            "function"
                            &&
                            window.obtenerModoHerramientas()
                            ===
                            "clase"
                        ) {

                            return;
                        }


                        cambiarVista(
                            boton.dataset.vista
                        );

                    }
                );

            }
        );
}


function cambiarVista(
    vista
) {

    if (
        vista === "constructor"
        &&
        typeof
            window.obtenerModoHerramientas
        ===
        "function"
        &&
        window.obtenerModoHerramientas()
        ===
        "clase"
    ) {

        vista =
            "calculadora";
    }


    const calculadora =
        document.getElementById(
            "vistaCalculadora"
        );


    const constructor =
        document.getElementById(
            "vistaConstructor"
        );


    const tabCalculadora =
        document.getElementById(
            "tabCalculadora"
        );


    const tabConstructor =
        document.getElementById(
            "tabConstructor"
        );


    calculadora.classList.remove(
        "activa"
    );


    constructor.classList.remove(
        "activa"
    );


    tabCalculadora.classList.remove(
        "activo"
    );


    tabConstructor.classList.remove(
        "activo"
    );


    if (
        vista === "constructor"
    ) {

        constructor.classList.add(
            "activa"
        );


        tabConstructor.classList.add(
            "activo"
        );


        if (
            typeof
                window
                    .inicializarConstructorSiNecesario
            ===
            "function"
        ) {

            window
                .inicializarConstructorSiNecesario();
        }


        setTimeout(
            () => {

                window.dispatchEvent(
                    new Event(
                        "resize"
                    )
                );

            },
            100
        );


        return;
    }


    calculadora.classList.add(
        "activa"
    );


    tabCalculadora.classList.add(
        "activo"
    );


    setTimeout(
        () => {

            window.dispatchEvent(
                new Event(
                    "resize"
                )
            );

        },
        100
    );
}


window.cambiarVista =
    cambiarVista;


function abrirCalculadoraConFuncion(
    latex
) {

    campoFuncionGlobal.value =
        latex;


    cambiarVista(
        "calculadora"
    );


    setTimeout(
        () => {

            campoFuncionGlobal.focus();

        },
        150
    );
}


window.abrirCalculadoraConFuncion =
    abrirCalculadoraConFuncion;


function configurarTeclado(
    campo
) {

    document
        .querySelectorAll(
            ".tecla"
        )
        .forEach(
            tecla => {

                tecla.addEventListener(
                    "click",
                    () => {

                        campo.focus();


                        campo.insert(
                            tecla.dataset.comando,
                            {

                                insertionMode:
                                    "replaceSelection",

                                selectionMode:
                                    "placeholder"
                            }
                        );

                    }
                );

            }
        );
}


function configurarEjemplos(
    funcion,
    inferior,
    superior
) {

    document
        .querySelectorAll(
            ".btn-ejemplo"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        funcion.value =
                            boton.dataset.funcion;


                        inferior.value =
                            boton.dataset.inferior;


                        superior.value =
                            boton.dataset.superior;

                    }
                );

            }
        );
}


function convertirLimite(
    valor
) {

    const texto =
        String(
            valor
        )
        .replaceAll(
            " ",
            ""
        )
        .trim();


    if (
        texto === "\\infty"
        ||
        texto === "+\\infty"
        ||
        texto === "∞"
    ) {

        return "inf";
    }


    if (
        texto === "-\\infty"
        ||
        texto === "-∞"
    ) {

        return "-inf";
    }


    return texto;
}


function formatearNumeroLimite(
    numero
) {

    return String(

        Math.round(
            numero
            *
            1000
        )

        /

        1000
    );
}


async function actualizarLimiteDesdeGrafica(
    tipo,
    nuevoValor
) {

    if (
        !Number.isFinite(
            nuevoValor
        )
    ) {

        return;
    }


    const texto =
        formatearNumeroLimite(
            nuevoValor
        );


    if (
        tipo === "inferior"
    ) {

        campoInferiorGlobal.value =
            texto;
    }


    if (
        tipo === "superior"
    ) {

        campoSuperiorGlobal.value =
            texto;
    }


    if (
        resolviendoDesdeGrafica
    ) {

        return;
    }


    resolviendoDesdeGrafica =
        true;


    try {

        await resolverIntegral(
            campoFuncionGlobal,
            campoInferiorGlobal,
            campoSuperiorGlobal,
            botonResolverGlobal
        );

    } finally {

        resolviendoDesdeGrafica =
            false;
    }
}


window.actualizarLimiteDesdeGrafica =
    actualizarLimiteDesdeGrafica;


async function resolverIntegral(
    campoFuncion,
    campoInferior,
    campoSuperior,
    boton
) {

    ocultarError();


    const funcionLatex =
        campoFuncion.value;


    const inferior =
        convertirLimite(
            campoInferior.value
        );


    const superior =
        convertirLimite(
            campoSuperior.value
        );


    if (
        !funcionLatex
        ||
        funcionLatex.trim()
        ===
        ""
    ) {

        mostrarError(
            "Debes introducir una función."
        );

        return;
    }


    boton.disabled =
        true;


    boton.textContent =
        "Analizando integral...";


    try {

        const respuesta =
            await fetch(
                API
                +
                "/api/resolver",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {

                                funcion:
                                    funcionLatex,

                                limite_inferior:
                                    inferior,

                                limite_superior:
                                    superior
                            }
                        )
                }
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "Error HTTP "
                +
                respuesta.status
            );
        }


        const datos =
            await respuesta.json();


        console.log(
            "Respuesta backend:",
            datos
        );


        if (
            !datos.ok
        ) {

            mostrarError(
                "No se pudo resolver la expresión: "
                +
                datos.error
            );

            return;
        }


        mostrarResultado(
            datos
        );


        graficarFuncion(
            datos.funcion_sympy,
            datos.limite_inferior,
            datos.limite_superior,
            datos.singularidades
            ||
            [],
            datos.funcion_latex,
            campoInferior.value,
            campoSuperior.value
        );


    } catch (
        error
    ) {

        console.error(
            error
        );


        mostrarError(
            "No se pudo conectar con el backend."
        );

    } finally {

        boton.disabled =
            false;


        boton.textContent =
            "Resolver y graficar";
    }
}


function mostrarResultado(
    datos
) {

    document
        .getElementById(
            "estadoInicial"
        )
        .classList
        .add(
            "oculto"
        );


    document
        .getElementById(
            "resultadoContenido"
        )
        .classList
        .remove(
            "oculto"
        );


    document
        .getElementById(
            "integralResultado"
        )
        .value =
            datos.integral_latex
            ||
            "";


    document
        .getElementById(
            "resultadoExacto"
        )
        .value =
            datos.resultado_latex
            ||
            "\\text{No determinado}";


    document
        .getElementById(
            "resultadoDecimal"
        )
        .textContent =
            datos.resultado_decimal
            ??
            "No aplica";


    const clasificacion =
        document.getElementById(
            "clasificacion"
        );


    const estado =
        datos.clasificacion
        ||
        "indeterminado";


    clasificacion.textContent =
        estado;


    clasificacion.className =
        "clasificacion "
        +
        estado;


    document
        .getElementById(
            "tipoIntegral"
        )
        .textContent =
            datos.tipo
            ||
            "No determinado";


    document
        .getElementById(
            "motivoIntegral"
        )
        .textContent =
            datos.motivo
            ||
            "";


    mostrarSingularidades(
        datos.singularidades
        ||
        []
    );


    mostrarDiagnosticoCuandoEsteListo(
        datos
    );


    mostrarAnalisisTramosCuandoEsteListo(
        datos
    );


    mostrarProcedimiento(
        datos.procedimiento
        ||
        []
    );
}


function mostrarDiagnosticoCuandoEsteListo(
    datos,
    intentos = 0
) {

    if (
        typeof
            window.mostrarDiagnosticoIntegral
        ===
        "function"
    ) {

        window
            .mostrarDiagnosticoIntegral(
                datos
            );


        return;
    }


    if (
        intentos >= 15
    ) {

        return;
    }


    setTimeout(
        () => {

            mostrarDiagnosticoCuandoEsteListo(
                datos,
                intentos + 1
            );

        },
        100
    );
}


function mostrarAnalisisTramosCuandoEsteListo(
    datos,
    intentos = 0
) {

    if (
        typeof
            window.mostrarAnalisisTramos
        ===
        "function"
    ) {

        window
            .mostrarAnalisisTramos(
                datos
            );


        return;
    }


    if (
        intentos >= 15
    ) {

        return;
    }


    setTimeout(
        () => {

            mostrarAnalisisTramosCuandoEsteListo(
                datos,
                intentos + 1
            );

        },
        100
    );
}


function mostrarSingularidades(
    singularidades
) {

    const contenedor =
        document.getElementById(
            "singularidades"
        );


    contenedor.innerHTML =
        "";


    if (
        singularidades.length
        ===
        0
    ) {

        const texto =
            document.createElement(
                "span"
            );


        texto.className =
            "sin-singularidades";


        texto.textContent =
            "No se detectaron";


        contenedor.appendChild(
            texto
        );


        return;
    }


    singularidades.forEach(
        singularidad => {

            const badge =
                document.createElement(
                    "span"
                );


            badge.className =
                "singularidad-badge";


            badge.textContent =
                "x = "
                +
                singularidad;


            contenedor.appendChild(
                badge
            );

        }
    );
}


function mostrarProcedimiento(
    procedimiento
) {

    const contenedor =
        document.getElementById(
            "procedimiento"
        );


    contenedor.innerHTML =
        "";


    procedimiento.forEach(
        paso => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "paso-procedimiento";


            const titulo =
                document.createElement(
                    "h4"
                );


            titulo.className =
                "paso-titulo";


            titulo.textContent =
                paso.titulo
                ||
                "Paso";


            const texto =
                document.createElement(
                    "p"
                );


            texto.className =
                "paso-texto";


            texto.textContent =
                paso.texto
                ||
                "";


            tarjeta.appendChild(
                titulo
            );


            tarjeta.appendChild(
                texto
            );


            if (
                paso.latex
            ) {

                const formula =
                    document.createElement(
                        "math-field"
                    );


                formula.className =
                    "formula-paso";


                formula.setAttribute(
                    "read-only",
                    ""
                );


                formula.value =
                    paso.latex;


                tarjeta.appendChild(
                    formula
                );
            }


            contenedor.appendChild(
                tarjeta
            );

        }
    );
}


function mostrarError(
    mensaje
) {

    const elemento =
        document.getElementById(
            "mensajeError"
        );


    elemento.textContent =
        mensaje;


    elemento.classList.remove(
        "oculto"
    );
}


function ocultarError() {

    const elemento =
        document.getElementById(
            "mensajeError"
        );


    elemento.classList.add(
        "oculto"
    );


    elemento.textContent =
        "";
}