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
# COLORES DE CONSOLA
# ============================================================

VERDE = "\033[92m"
ROJO = "\033[91m"
AMARILLO = "\033[93m"
AZUL = "\033[94m"
RESET = "\033[0m"


# ============================================================
# UTILIDADES
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


        valor_actual = complex(
            sp.N(
                actual,
                15
            )
        )


        valor_esperado = complex(
            sp.N(
                esperado,
                15
            )
        )


        return (
            abs(
                valor_actual
                -
                valor_esperado
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
# MOSTRAR CABECERA
# ============================================================

def mostrar_cabecera():

    print()
    print(
        "="
        *
        72
    )

    print(
        "BANCO DE PRUEBAS - MOTOR DE INTEGRALES IMPROPIAS"
    )

    print(
        "="
        *
        72
    )

    print()


# ============================================================
# EJECUTAR UNA PRUEBA
# ============================================================

def ejecutar_prueba(
    numero,
    nombre,
    funcion_latex,
    limite_inferior,
    limite_superior,
    clasificacion_esperada,
    resultado_esperado=None,
    singularidades_esperadas=None
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
        72
    )


    try:

        # ----------------------------------------------------
        # PARSER
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
        # ANÁLISIS
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
        # MOSTRAR INFORMACIÓN
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
            "Tipo detectado:"
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

            actuales = {

                str(
                    sp.simplify(
                        sp.sympify(
                            valor
                        )
                    )
                )

                for valor
                in singularidades_actuales

            }


            esperadas = {

                str(
                    sp.simplify(
                        sp.sympify(
                            valor
                        )
                    )
                )

                for valor
                in singularidades_esperadas

            }


            singularidades_correctas = (

                actuales
                ==
                esperadas

            )


        # ====================================================
        # RESULTADO FINAL DE LA PRUEBA
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
        72
    )
    print()


# ============================================================
# TODAS LAS PRUEBAS
# ============================================================

def ejecutar_todas_las_pruebas():

    mostrar_cabecera()


    # ========================================================
    # 01
    #
    # Integral clásica convergente
    # ========================================================

    ejecutar_prueba(

        1,

        "1/x^2 desde 1 hasta infinito",

        r"\frac{1}{x^2}",

        "1",

        "inf",

        "convergente",

        "1",

        []
    )


    # ========================================================
    # 02
    #
    # Integral p = 1
    # ========================================================

    ejecutar_prueba(

        2,

        "1/x desde 1 hasta infinito",

        r"\frac{1}{x}",

        "1",

        "inf",

        "divergente",

        None,

        []
    )


    # ========================================================
    # 03
    #
    # Discontinuidad convergente
    # ========================================================

    ejecutar_prueba(

        3,

        "1/sqrt(x) desde 0 hasta 1",

        r"\frac{1}{\sqrt{x}}",

        "0",

        "1",

        "convergente",

        "2",

        ["0"]
    )


    # ========================================================
    # 04
    #
    # Exponencial
    # ========================================================

    ejecutar_prueba(

        4,

        "e^(-x) desde 0 hasta infinito",

        r"e^{-x}",

        "0",

        "inf",

        "convergente",

        "1",

        []
    )


    # ========================================================
    # 05
    #
    # De -infinito a +infinito
    # ========================================================

    ejecutar_prueba(

        5,

        "1/(x^2+1) sobre toda la recta real",

        r"\frac{1}{x^2+1}",

        "-inf",

        "inf",

        "convergente",

        "pi",

        []
    )


    # ========================================================
    # 06
    #
    # Singularidad interior divergente
    # ========================================================

    ejecutar_prueba(

        6,

        "1/(x-2)^2 desde 0 hasta 4",

        r"\frac{1}{(x-2)^2}",

        "0",

        "4",

        "divergente",

        None,

        ["2"]
    )


    # ========================================================
    # 07
    #
    # Singularidad en extremo
    # ========================================================

    ejecutar_prueba(

        7,

        "1/sqrt(x-1) desde 1 hasta 4",

        r"\frac{1}{\sqrt{x-1}}",

        "1",

        "4",

        "convergente",

        "2*sqrt(3)",

        ["1"]
    )


    # ========================================================
    # 08
    #
    # Logaritmo impropio
    # ========================================================

    ejecutar_prueba(

        8,

        "ln(x) desde 0 hasta 1",

        r"\ln(x)",

        "0",

        "1",

        "convergente",

        "-1",

        ["0"]
    )


    # ========================================================
    # 09
    #
    # Infinito negativo
    # ========================================================

    ejecutar_prueba(

        9,

        "1/x^2 desde -infinito hasta -1",

        r"\frac{1}{x^2}",

        "-inf",

        "-1",

        "convergente",

        "1",

        []
    )


    # ========================================================
    # 10
    #
    # Singularidad interior
    # ========================================================

    ejecutar_prueba(

        10,

        "1/x^2 desde -1 hasta 1",

        r"\frac{1}{x^2}",

        "-1",

        "1",

        "divergente",

        None,

        ["0"]
    )


    # ========================================================
    # 11
    #
    # DOS singularidades
    # ========================================================

    ejecutar_prueba(

        11,

        "Dos singularidades: 1/(x(x-2))",

        r"\frac{1}{x(x-2)}",

        "-1",

        "3",

        "divergente",

        None,

        [
            "0",
            "2"
        ]
    )


    # ========================================================
    # 12
    #
    # Integral propia
    # ========================================================

    ejecutar_prueba(

        12,

        "Integral propia x^2 desde 0 hasta 3",

        r"x^2",

        "0",

        "3",

        "convergente",

        "9",

        []
    )


    # ========================================================
    # 13
    #
    # EXPONENTE FRACCIONARIO
    # ========================================================

    ejecutar_prueba(

        13,

        "Potencia fraccionaria 1/x^(3/2)",

        r"\frac{1}{x^{\frac{3}{2}}}",

        "1",

        "inf",

        "convergente",

        "2",

        []
    )


    # ========================================================
    # 14
    #
    # Potencia fraccionaria divergente
    # ========================================================

    ejecutar_prueba(

        14,

        "1/sqrt(x) desde 1 hasta infinito",

        r"\frac{1}{\sqrt{x}}",

        "1",

        "inf",

        "divergente",

        None,

        []
    )


    # ========================================================
    # 15
    #
    # Integral gaussiana
    #
    # Esta ya es una prueba bastante mas fuerte.
    # ========================================================

    ejecutar_prueba(

        15,

        "Integral gaussiana e^(-x^2)",

        r"e^{-x^2}",

        "-inf",

        "inf",

        "convergente",

        "sqrt(pi)",

        []
    )


    # ========================================================
    # RESUMEN
    # ========================================================

    print()
    print(
        "="
        *
        72
    )

    print(
        "RESUMEN FINAL"
    )

    print(
        "="
        *
        72
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
            f"Fallidas: 0"
            f"{RESET}"
        )


        print()

        print(
            f"{VERDE}"
            "MOTOR MATEMATICO: "
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
            "Hay casos que debemos revisar "
            "antes de continuar."
            f"{RESET}"
        )


    print()
    print(
        "="
        *
        72
    )


# ============================================================
# EJECUCIÓN
# ============================================================

if __name__ == "__main__":

    ejecutar_todas_las_pruebas()