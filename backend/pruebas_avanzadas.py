import sympy as sp

from core.parser_matematico import (
    x,
    parsear_funcion,
    interpretar_limite
)

from core.analizador import (
    analizar_integral
)


# ============================================================
# CONFIGURACIÓN
# ============================================================

TOTAL_PRUEBAS = 0
PRUEBAS_CORRECTAS = 0
PRUEBAS_FALLIDAS = 0


# ============================================================
# COLORES
# ============================================================

VERDE = "\033[92m"
ROJO = "\033[91m"
AMARILLO = "\033[93m"
AZUL = "\033[94m"
MORADO = "\033[95m"
RESET = "\033[0m"


# ============================================================
# COMPARAR RESULTADOS SIMBÓLICOS
# ============================================================

def son_equivalentes(
    resultado_actual,
    resultado_esperado
):

    if resultado_actual is None:
        return False


    try:

        actual = sp.sympify(
            resultado_actual
        )


        esperado = sp.sympify(
            resultado_esperado
        )


        diferencia = sp.simplify(
            actual
            -
            esperado
        )


        if diferencia == 0:
            return True


        actual_numerico = complex(
            sp.N(
                actual,
                18
            )
        )


        esperado_numerico = complex(
            sp.N(
                esperado,
                18
            )
        )


        return (
            abs(
                actual_numerico
                -
                esperado_numerico
            )
            <
            1e-8
        )


    except Exception:

        return (
            str(resultado_actual)
            ==
            str(resultado_esperado)
        )


# ============================================================
# NORMALIZAR SINGULARIDADES
# ============================================================

def normalizar_singularidades(
    singularidades
):

    resultado = set()


    for valor in singularidades:

        try:

            simbolico = sp.sympify(
                valor
            )


            resultado.add(
                str(
                    sp.simplify(
                        simbolico
                    )
                )
            )


        except Exception:

            resultado.add(
                str(valor)
            )


    return resultado


# ============================================================
# CABECERA
# ============================================================

def mostrar_cabecera():

    print()

    print(
        "="
        *
        78
    )

    print(
        f"{MORADO}"
        "BANCO AVANZADO - MOTOR DE INTEGRALES IMPROPIAS"
        f"{RESET}"
    )

    print(
        "="
        *
        78
    )

    print()

    print(
        "Este banco incluye convergencia condicional, "
        "singularidades multiples,"
    )

    print(
        "intervalos infinitos y casos que no deben confundirse "
        "con valor principal."
    )

    print()

    print(
        "="
        *
        78
    )

    print()


# ============================================================
# EJECUTAR PRUEBA
# ============================================================

def ejecutar_prueba(
    numero,
    nombre,
    funcion_latex,
    limite_inferior,
    limite_superior,
    clasificacion_esperada,
    resultado_esperado=None,
    singularidades_esperadas=None,
    comentario=None
):

    global TOTAL_PRUEBAS
    global PRUEBAS_CORRECTAS
    global PRUEBAS_FALLIDAS


    TOTAL_PRUEBAS += 1


    print(
        f"{AZUL}"
        f"PRUEBA {numero}: {nombre}"
        f"{RESET}"
    )


    print(
        "-"
        *
        78
    )


    if comentario:

        print(
            f"{AMARILLO}"
            f"Objetivo: {comentario}"
            f"{RESET}"
        )

        print()


    try:

        # ----------------------------------------------------
        # PARSEAR
        # ----------------------------------------------------

        funcion = parsear_funcion(
            funcion_latex
        )


        inferior = interpretar_limite(
            limite_inferior
        )


        superior = interpretar_limite(
            limite_superior
        )


        # ----------------------------------------------------
        # ANALIZAR
        # ----------------------------------------------------

        resultado = analizar_integral(
            funcion,
            inferior,
            superior
        )


        clasificacion_actual = (
            resultado[
                "clasificacion"
            ]
        )


        resultado_actual = (
            resultado[
                "resultado"
            ]
        )


        singularidades_actuales = (
            resultado[
                "singularidades"
            ]
        )


        tipo_actual = (
            resultado[
                "tipo"
            ]
        )


        # ----------------------------------------------------
        # MOSTRAR
        # ----------------------------------------------------

        print(
            "Funcion:"
        )

        print(
            f"    {funcion}"
        )


        print(
            "Intervalo:"
        )

        print(
            f"    [{inferior}, {superior}]"
        )


        print(
            "Tipo:"
        )

        print(
            f"    {tipo_actual}"
        )


        print(
            "Singularidades:"
        )

        print(
            f"    {singularidades_actuales}"
        )


        print(
            "Clasificacion:"
        )

        print(
            f"    {clasificacion_actual}"
        )


        print(
            "Resultado:"
        )

        print(
            f"    {resultado_actual}"
        )


        # ====================================================
        # VALIDAR CLASIFICACIÓN
        # ====================================================

        clasificacion_correcta = (

            clasificacion_actual
            ==
            clasificacion_esperada

        )


        # ====================================================
        # VALIDAR RESULTADO
        # ====================================================

        resultado_correcto = True


        if (
            resultado_esperado
            is not None
        ):

            resultado_correcto = (
                son_equivalentes(
                    resultado_actual,
                    resultado_esperado
                )
            )


        # ====================================================
        # VALIDAR SINGULARIDADES
        # ====================================================

        singularidades_correctas = True


        if (
            singularidades_esperadas
            is not None
        ):

            actuales = (
                normalizar_singularidades(
                    singularidades_actuales
                )
            )


            esperadas = (
                normalizar_singularidades(
                    singularidades_esperadas
                )
            )


            singularidades_correctas = (

                actuales
                ==
                esperadas

            )


        # ====================================================
        # RESULTADO FINAL
        # ====================================================

        if (
            clasificacion_correcta
            and
            resultado_correcto
            and
            singularidades_correctas
        ):

            PRUEBAS_CORRECTAS += 1


            print()

            print(
                f"{VERDE}"
                "[OK] PRUEBA SUPERADA"
                f"{RESET}"
            )


        else:

            PRUEBAS_FALLIDAS += 1


            print()

            print(
                f"{ROJO}"
                "[ERROR] PRUEBA FALLIDA"
                f"{RESET}"
            )


            if (
                not clasificacion_correcta
            ):

                print(
                    f"{ROJO}"
                    "  Clasificacion esperada:"
                    f" {clasificacion_esperada}"
                    f"{RESET}"
                )


            if (
                not resultado_correcto
            ):

                print(
                    f"{ROJO}"
                    "  Resultado esperado:"
                    f" {resultado_esperado}"
                    f"{RESET}"
                )


            if (
                not singularidades_correctas
            ):

                print(
                    f"{ROJO}"
                    "  Singularidades esperadas:"
                    f" {singularidades_esperadas}"
                    f"{RESET}"
                )


    except Exception as error:

        PRUEBAS_FALLIDAS += 1


        print()

        print(
            f"{ROJO}"
            "[ERROR] EXCEPCION"
            f"{RESET}"
        )


        print(
            f"{ROJO}"
            f"{type(error).__name__}: "
            f"{error}"
            f"{RESET}"
        )


    print()

    print(
        "="
        *
        78
    )

    print()


# ============================================================
# BANCO COMPLETO
# ============================================================

def ejecutar_todas_las_pruebas():

    mostrar_cabecera()


    # ========================================================
    # 01
    #
    # Convergencia condicional.
    # ========================================================

    ejecutar_prueba(

        1,

        "sin(x)/x desde 1 hasta infinito",

        r"\frac{\sin(x)}{x}",

        "1",

        "inf",

        "convergente",

        "pi/2 - Si(1)",

        [],

        (
            "Comprobar convergencia condicional "
            "con una integral oscilatoria."
        )
    )


    # ========================================================
    # 02
    #
    # Racional no trivial.
    # ========================================================

    ejecutar_prueba(

        2,

        "1/(x^2-1) desde 2 hasta infinito",

        r"\frac{1}{x^2-1}",

        "2",

        "inf",

        "convergente",

        "log(3)/2",

        [],

        (
            "Comprobar una funcion racional con "
            "singularidades fuera del intervalo."
        )
    )


    # ========================================================
    # 03
    #
    # Singularidad + infinito.
    # ========================================================

    ejecutar_prueba(

        3,

        "e^(-x)/sqrt(x) desde 0 hasta infinito",

        r"\frac{e^{-x}}{\sqrt{x}}",

        "0",

        "inf",

        "convergente",

        "sqrt(pi)",

        ["0"],

        (
            "Combinar una singularidad en el extremo "
            "con un intervalo infinito."
        )
    )


    # ========================================================
    # 04
    #
    # Logaritmo convergente.
    # ========================================================

    ejecutar_prueba(

        4,

        "1/(x ln(x)^2) desde e hasta infinito",

        r"\frac{1}{x(\ln(x))^2}",

        "E",

        "inf",

        "convergente",

        "1",

        [],

        (
            "Comprobar una integral impropia logaritmica."
        )
    )


    # ========================================================
    # 05
    #
    # Logaritmo divergente.
    # ========================================================

    ejecutar_prueba(

        5,

        "1/(x ln(x)) desde e hasta infinito",

        r"\frac{1}{x\ln(x)}",

        "E",

        "inf",

        "divergente",

        None,

        [],

        (
            "Distinguir el caso limite que diverge "
            "lentamente."
        )
    )


    # ========================================================
    # 06
    #
    # Potencia fraccionaria en extremo.
    # ========================================================

    ejecutar_prueba(

        6,

        "1/x^(2/3) desde 0 hasta 1",

        r"\frac{1}{x^{\frac{2}{3}}}",

        "0",

        "1",

        "convergente",

        "3",

        ["0"],

        (
            "Comprobar potencia fraccionaria singular "
            "pero integrable."
        )
    )


    # ========================================================
    # 07
    #
    # Singularidad + infinito con resultado pi.
    # ========================================================

    ejecutar_prueba(

        7,

        "1/(sqrt(x)(1+x)) desde 0 hasta infinito",

        r"\frac{1}{\sqrt{x}(1+x)}",

        "0",

        "inf",

        "convergente",

        "pi",

        ["0"],

        (
            "Caso mixto con singularidad inicial "
            "e infinito superior."
        )
    )


    # ========================================================
    # 08
    #
    # Singularidad interior racional.
    # ========================================================

    ejecutar_prueba(

        8,

        "1/(x^2-1) desde 0 hasta 2",

        r"\frac{1}{x^2-1}",

        "0",

        "2",

        "divergente",

        None,

        ["1"],

        (
            "Detectar solamente la singularidad "
            "que pertenece al intervalo."
        )
    )


    # ========================================================
    # 09
    #
    # Dos singularidades + dos infinitos.
    # ========================================================

    ejecutar_prueba(

        9,

        "1/(x^2-1) desde -infinito hasta infinito",

        r"\frac{1}{x^2-1}",

        "-inf",

        "inf",

        "divergente",

        None,

        [
            "-1",
            "1"
        ],

        (
            "Probar simultaneamente dos infinitos "
            "y dos discontinuidades."
        )
    )


    # ========================================================
    # 10
    #
    # Exponencial trigonometrica.
    # ========================================================

    ejecutar_prueba(

        10,

        "e^(-x) cos(x) desde 0 hasta infinito",

        r"e^{-x}\cos(x)",

        "0",

        "inf",

        "convergente",

        "1/2",

        [],

        (
            "Comprobar producto de funcion "
            "exponencial y trigonometrica."
        )
    )


    # ========================================================
    # 11
    #
    # Función con discontinuidad removible.
    # ========================================================

    ejecutar_prueba(

        11,

        "sin(x)/x desde 0 hasta infinito",

        r"\frac{\sin(x)}{x}",

        "0",

        "inf",

        "convergente",

        "pi/2",

        ["0"],

        (
            "Comprobar un extremo donde la expresion "
            "no esta definida pero el limite existe."
        )
    )


    # ========================================================
    # 12
    #
    # CASO MUY IMPORTANTE:
    #
    # El valor principal sería cero,
    # pero la integral impropia diverge.
    # ========================================================

    ejecutar_prueba(

        12,

        "1/x desde -1 hasta 1",

        r"\frac{1}{x}",

        "-1",

        "1",

        "divergente",

        None,

        ["0"],

        (
            "Evitar confundir la integral impropia "
            "con el valor principal de Cauchy."
        )
    )


    # ========================================================
    # 13
    #
    # Logaritmo sobre potencia.
    # ========================================================

    ejecutar_prueba(

        13,

        "ln(x)/x^2 desde 1 hasta infinito",

        r"\frac{\ln(x)}{x^2}",

        "1",

        "inf",

        "convergente",

        "1",

        [],

        (
            "Comprobar logaritmo combinado con "
            "decaimiento algebraico."
        )
    )


    # ========================================================
    # 14
    #
    # Dos singularidades en extremos.
    # ========================================================

    ejecutar_prueba(

        14,

        "1/sqrt(1-x^2) desde -1 hasta 1",

        r"\frac{1}{\sqrt{1-x^2}}",

        "-1",

        "1",

        "convergente",

        "pi",

        [
            "-1",
            "1"
        ],

        (
            "Comprobar una integral con "
            "ambos extremos singulares."
        )
    )


    # ========================================================
    # 15
    #
    # Otro caso de valor principal engañoso.
    # ========================================================

    ejecutar_prueba(

        15,

        "1/(x-1) desde 0 hasta 2",

        r"\frac{1}{x-1}",

        "0",

        "2",

        "divergente",

        None,

        ["1"],

        (
            "La simetria no debe hacer que el motor "
            "declare convergencia."
        )
    )


    # ========================================================
    # 16
    #
    # Integral racional sobre toda R.
    # ========================================================

    ejecutar_prueba(

        16,

        "1/(1+x^4) sobre toda la recta real",

        r"\frac{1}{1+x^4}",

        "-inf",

        "inf",

        "convergente",

        "pi/sqrt(2)",

        [],

        (
            "Probar una integral impropia de "
            "mayor complejidad simbolica."
        )
    )


    # ========================================================
    # 17
    #
    # Integral tipo Gamma.
    # ========================================================

    ejecutar_prueba(

        17,

        "sqrt(x)e^(-x) desde 0 hasta infinito",

        r"\sqrt{x}e^{-x}",

        "0",

        "inf",

        "convergente",

        "sqrt(pi)/2",

        [],

        (
            "Comprobar una integral relacionada "
            "con la funcion Gamma."
        )
    )


    # ========================================================
    # 18
    #
    # Potencia p > 1.
    # ========================================================

    ejecutar_prueba(

        18,

        "1/x^(5/4) desde 1 hasta infinito",

        r"\frac{1}{x^{\frac{5}{4}}}",

        "1",

        "inf",

        "convergente",

        "4",

        [],

        (
            "Confirmar nuevamente el criterio de "
            "potencias con exponente fraccionario."
        )
    )


    # ========================================================
    # RESUMEN
    # ========================================================

    print()

    print(
        "="
        *
        78
    )


    print(
        "RESUMEN FINAL - BANCO AVANZADO"
    )


    print(
        "="
        *
        78
    )


    print(
        f"Total de pruebas: "
        f"{TOTAL_PRUEBAS}"
    )


    print(
        f"{VERDE}"
        f"Correctas: "
        f"{PRUEBAS_CORRECTAS}"
        f"{RESET}"
    )


    if (
        PRUEBAS_FALLIDAS
        ==
        0
    ):

        print(
            f"{VERDE}"
            "Fallidas: 0"
            f"{RESET}"
        )


        print()

        print(
            f"{VERDE}"
            "MOTOR AVANZADO: "
            "TODAS LAS PRUEBAS SUPERADAS"
            f"{RESET}"
        )


    else:

        print(
            f"{ROJO}"
            f"Fallidas: "
            f"{PRUEBAS_FALLIDAS}"
            f"{RESET}"
        )


        print()

        print(
            f"{AMARILLO}"
            "Encontramos casos que requieren "
            "fortalecer el motor."
            f"{RESET}"
        )


    print()

    print(
        "="
        *
        78
    )


# ============================================================
# EJECUCIÓN
# ============================================================

if __name__ == "__main__":

    ejecutar_todas_las_pruebas()
    