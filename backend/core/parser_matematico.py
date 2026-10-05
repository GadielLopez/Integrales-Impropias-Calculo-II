import re

import sympy as sp

from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
    function_exponentiation
)


x = sp.symbols(
    "x",
    real=True
)


TRANSFORMACIONES = (
    standard_transformations
    +
    (
        convert_xor,
        function_exponentiation,
        implicit_multiplication_application
    )
)


DICCIONARIO_LOCAL = {

    "x":
        x,

    "pi":
        sp.pi,

    "E":
        sp.E,

    "e":
        sp.E,

    "sin":
        sp.sin,

    "cos":
        sp.cos,

    "tan":
        sp.tan,

    "sec":
        sp.sec,

    "csc":
        sp.csc,

    "cot":
        sp.cot,

    "log":
        sp.log,

    "ln":
        sp.log,

    "sqrt":
        sp.sqrt,

    "exp":
        sp.exp,

    "abs":
        sp.Abs
}


def _extraer_grupo(
    texto,
    inicio,
    apertura="{",
    cierre="}"
):

    if (
        inicio >= len(texto)
        or
        texto[inicio] != apertura
    ):

        raise ValueError(
            "Se esperaba un grupo matemático."
        )


    profundidad = 0


    for indice in range(
        inicio,
        len(texto)
    ):

        caracter = texto[
            indice
        ]


        if (
            caracter == apertura
        ):

            profundidad += 1


        elif (
            caracter == cierre
        ):

            profundidad -= 1


            if (
                profundidad == 0
            ):

                return (

                    texto[
                        inicio + 1:
                        indice
                    ],

                    indice + 1
                )


    raise ValueError(
        "La expresión contiene grupos sin cerrar."
    )


def _extraer_argumento_latex(
    texto,
    inicio
):

    cursor = inicio


    while (
        cursor < len(texto)
        and
        texto[cursor].isspace()
    ):

        cursor += 1


    if (
        cursor >= len(texto)
    ):

        raise ValueError(
            "Falta un argumento matemático."
        )


    if (
        texto[cursor] == "{"
    ):

        return _extraer_grupo(
            texto,
            cursor
        )


    if (
        texto[cursor] == "\\"
    ):

        final = (
            cursor + 1
        )


        while (
            final < len(texto)
            and
            texto[final].isalpha()
        ):

            final += 1


        if (
            final == cursor + 1
        ):

            final = min(
                cursor + 2,
                len(texto)
            )


        return (

            texto[
                cursor:
                final
            ],

            final
        )


    if (
        texto[cursor] == "-"
    ):

        argumento, final = (
            _extraer_argumento_latex(
                texto,
                cursor + 1
            )
        )


        return (

            "-"
            +
            argumento,

            final
        )


    return (

        texto[cursor],

        cursor + 1
    )


def _convertir_fracciones(
    texto
):

    while (
        r"\frac"
        in
        texto
    ):

        indice = texto.rfind(
            r"\frac"
        )


        cursor = (

            indice

            +

            len(
                r"\frac"
            )
        )


        numerador, despues_numerador = (
            _extraer_argumento_latex(
                texto,
                cursor
            )
        )


        denominador, despues_denominador = (
            _extraer_argumento_latex(
                texto,
                despues_numerador
            )
        )


        numerador_convertido = (
            _latex_a_texto(
                numerador
            )
        )


        denominador_convertido = (
            _latex_a_texto(
                denominador
            )
        )


        reemplazo = (

            "(("

            +

            numerador_convertido

            +

            ")/("

            +

            denominador_convertido

            +

            "))"
        )


        texto = (

            texto[
                :indice
            ]

            +

            reemplazo

            +

            texto[
                despues_denominador:
            ]
        )


    return texto


def _convertir_raices(
    texto
):

    while (
        r"\sqrt"
        in
        texto
    ):

        indice = texto.rfind(
            r"\sqrt"
        )


        cursor = (

            indice

            +

            len(
                r"\sqrt"
            )
        )


        while (
            cursor < len(texto)
            and
            texto[cursor].isspace()
        ):

            cursor += 1


        indice_raiz = None


        if (
            cursor < len(texto)
            and
            texto[cursor] == "["
        ):

            indice_raiz, cursor = (
                _extraer_grupo(
                    texto,
                    cursor,
                    "[",
                    "]"
                )
            )


        radicando, despues = (
            _extraer_argumento_latex(
                texto,
                cursor
            )
        )


        radicando_convertido = (
            _latex_a_texto(
                radicando
            )
        )


        if (
            indice_raiz is None
        ):

            reemplazo = (

                "sqrt("

                +

                radicando_convertido

                +

                ")"
            )


        else:

            indice_convertido = (
                _latex_a_texto(
                    indice_raiz
                )
            )


            reemplazo = (

                "(("

                +

                radicando_convertido

                +

                ")**(1/("

                +

                indice_convertido

                +

                ")))"
            )


        texto = (

            texto[
                :indice
            ]

            +

            reemplazo

            +

            texto[
                despues:
            ]
        )


    return texto


def _insertar_multiplicaciones(
    texto
):

    funciones = (
        r"(?:sin|cos|tan|sec|csc|cot|"
        r"log|sqrt|exp|abs)"
    )


    texto = re.sub(

        rf"(?<=[0-9xEe\)])(?={funciones}\()",

        "*",

        texto
    )


    texto = re.sub(

        r"(?<=\))(?=[xEe0-9\(])",

        "*",

        texto
    )


    texto = re.sub(

        r"(?<=[0-9xEe])(?=\()",

        "*",

        texto
    )


    return texto


def _latex_a_texto(
    expresion
):

    texto = str(
        expresion
    ).strip()


    texto = texto.replace(
        r"\left",
        ""
    )


    texto = texto.replace(
        r"\right",
        ""
    )


    texto = texto.replace(
        r"\,",
        ""
    )


    texto = texto.replace(
        r"\;",
        ""
    )


    texto = texto.replace(
        r"\!",
        ""
    )


    texto = texto.replace(
        r"\cdot",
        "*"
    )


    texto = texto.replace(
        r"\times",
        "*"
    )


    texto = _convertir_fracciones(
        texto
    )


    texto = _convertir_raices(
        texto
    )


    reemplazos = {

        r"\sin":
            "sin",

        r"\cos":
            "cos",

        r"\tan":
            "tan",

        r"\sec":
            "sec",

        r"\csc":
            "csc",

        r"\cot":
            "cot",

        r"\ln":
            "log",

        r"\log":
            "log",

        r"\exp":
            "exp"
    }


    for original, nuevo in (
        reemplazos.items()
    ):

        texto = texto.replace(
            original,
            nuevo
        )


    texto = texto.replace(
        "ln(",
        "log("
    )


    texto = texto.replace(
        r"\pi",
        "pi"
    )


    texto = texto.replace(
        r"\infty",
        "oo"
    )


    texto = texto.replace(
        "∞",
        "oo"
    )


    texto = texto.replace(
        "^",
        "**"
    )


    texto = texto.replace(
        "{",
        "("
    )


    texto = texto.replace(
        "}",
        ")"
    )


    texto = _insertar_multiplicaciones(
        texto
    )


    return texto


def parsear_funcion(
    expresion
):

    if (
        expresion is None
        or
        str(
            expresion
        ).strip()
        ==
        ""
    ):

        raise ValueError(
            "La función no puede estar vacía."
        )


    expresion = str(
        expresion
    ).strip()


    texto = _latex_a_texto(
        expresion
    )


    try:

        funcion = parse_expr(

            texto,

            local_dict=
                DICCIONARIO_LOCAL,

            transformations=
                TRANSFORMACIONES,

            evaluate=
                True
        )


        funcion = sp.simplify(
            funcion
        )


    except Exception as error:

        raise ValueError(

            "No fue posible interpretar la función: "

            +

            expresion

            +

            ". Detalle: "

            +

            str(
                error
            )

        ) from error


    variables = (

        funcion.free_symbols

        -

        {
            x
        }
    )


    if (
        variables
    ):

        raise ValueError(

            "La función contiene variables no permitidas: "

            +

            ", ".join(

                sorted(

                    str(
                        variable
                    )

                    for variable
                    in variables
                )
            )
        )


    return funcion


def interpretar_limite(
    valor
):

    if (
        valor is None
        or
        str(
            valor
        ).strip()
        ==
        ""
    ):

        raise ValueError(
            "El límite no puede estar vacío."
        )


    texto = str(
        valor
    ).strip()


    compacto = texto.replace(
        " ",
        ""
    )


    positivos = {

        "inf",

        "+inf",

        "oo",

        "+oo",

        "∞",

        "+∞",

        r"\infty",

        r"+\infty"
    }


    negativos = {

        "-inf",

        "-oo",

        "-∞",

        r"-\infty"
    }


    if (
        compacto
        in
        positivos
    ):

        return sp.oo


    if (
        compacto
        in
        negativos
    ):

        return -sp.oo


    convertido = _latex_a_texto(
        texto
    )


    try:

        limite = parse_expr(

            convertido,

            local_dict=
                DICCIONARIO_LOCAL,

            transformations=
                TRANSFORMACIONES,

            evaluate=
                True
        )


        limite = sp.simplify(
            limite
        )


    except Exception as error:

        raise ValueError(

            "No fue posible interpretar el límite: "

            +

            str(
                valor
            )

        ) from error


    if (
        x
        in
        limite.free_symbols
    ):

        raise ValueError(
            "Los límites no pueden depender de x."
        )


    if (
        limite.is_real
        is
        False
    ):

        raise ValueError(
            "El límite debe ser un número real."
        )


    return limite