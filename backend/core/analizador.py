import sympy as sp

from core.parser_matematico import x


def _convertir_potencias_racionales_reales(expresion):

    def necesita_conversion(elemento):

        return (
            isinstance(elemento, sp.Pow)
            and elemento.exp.is_Rational
            and int(elemento.exp.q) > 1
            and int(elemento.exp.q) % 2 == 1
        )


    def convertir(elemento):

        base = elemento.base
        numerador = int(elemento.exp.p)
        denominador = int(elemento.exp.q)

        potencia = (
            sp.Abs(base)
            **
            sp.Rational(
                numerador,
                denominador
            )
        )

        if (
            abs(numerador) % 2 == 1
        ):

            return (
                sp.sign(base)
                *
                potencia
            )

        return potencia


    return expresion.replace(
        necesita_conversion,
        convertir
    )


def _son_iguales(a, b):

    try:

        return (
            sp.simplify(
                a - b
            )
            ==
            0
        )

    except Exception:

        return (
            str(a)
            ==
            str(b)
        )


def _valor_numerico(expresion):

    try:

        return float(
            sp.N(
                expresion,
                15
            )
        )

    except Exception:

        return None


def _punto_en_intervalo(
    punto,
    inferior,
    superior
):

    if (
        punto.is_real
        is
        False
    ):

        return False


    valor_punto = _valor_numerico(
        punto
    )


    if (
        valor_punto
        is
        None
    ):

        return False


    if (
        inferior
        !=
        -sp.oo
    ):

        valor_inferior = (
            _valor_numerico(
                inferior
            )
        )


        if (
            valor_inferior is not None
            and
            valor_punto
            <
            valor_inferior
            -
            1e-10
        ):

            return False


    if (
        superior
        !=
        sp.oo
    ):

        valor_superior = (
            _valor_numerico(
                superior
            )
        )


        if (
            valor_superior is not None
            and
            valor_punto
            >
            valor_superior
            +
            1e-10
        ):

            return False


    return True


def obtener_singularidades(
    funcion,
    inferior,
    superior
):

    candidatos = []


    try:

        conjunto = sp.singularities(
            funcion,
            x
        )


        if (
            isinstance(
                conjunto,
                sp.FiniteSet
            )
        ):

            candidatos.extend(
                list(
                    conjunto
                )
            )

    except Exception:

        pass


    try:

        denominador = sp.denom(
            sp.together(
                funcion
            )
        )


        if (
            denominador
            !=
            1
        ):

            soluciones = sp.solve(
                sp.Eq(
                    denominador,
                    0
                ),
                x
            )


            candidatos.extend(
                soluciones
            )

    except Exception:

        pass


    singularidades = []


    for punto in candidatos:

        punto = sp.simplify(
            punto
        )


        if (
            not _punto_en_intervalo(
                punto,
                inferior,
                superior
            )
        ):

            continue


        repetido = any(

            _son_iguales(
                punto,
                existente
            )

            for existente
            in singularidades
        )


        if (
            not repetido
        ):

            singularidades.append(
                punto
            )


    singularidades.sort(

        key=lambda valor:

            _valor_numerico(
                valor
            )

            if (
                _valor_numerico(
                    valor
                )
                is not None
            )

            else
            0
    )


    return singularidades


def _clasificar_tipo(
    inferior,
    superior,
    singularidades
):

    inferior_infinito = (
        inferior == -sp.oo
    )


    superior_infinito = (
        superior == sp.oo
    )


    hay_infinito = (
        inferior_infinito
        or
        superior_infinito
    )


    hay_singularidades = (
        len(
            singularidades
        )
        >
        0
    )


    if (
        hay_infinito
        and
        hay_singularidades
    ):

        return (
            "Integral impropia mixta"
        )


    if (
        inferior_infinito
        and
        superior_infinito
    ):

        return (
            "Intervalo no acotado en ambos extremos"
        )


    if (
        superior_infinito
    ):

        return (
            "Intervalo no acotado hacia +∞"
        )


    if (
        inferior_infinito
    ):

        return (
            "Intervalo no acotado hacia -∞"
        )


    singular_inferior = any(

        _son_iguales(
            punto,
            inferior
        )

        for punto
        in singularidades
    )


    singular_superior = any(

        _son_iguales(
            punto,
            superior
        )

        for punto
        in singularidades
    )


    interiores = [

        punto

        for punto
        in singularidades

        if (
            not _son_iguales(
                punto,
                inferior
            )
            and
            not _son_iguales(
                punto,
                superior
            )
        )
    ]


    if (
        interiores
    ):

        return (
            "Discontinuidad dentro del intervalo"
        )


    if (
        singular_inferior
        and
        singular_superior
    ):

        return (
            "Discontinuidad en ambos extremos"
        )


    if (
        singular_inferior
        or
        singular_superior
    ):

        return (
            "Discontinuidad en un extremo"
        )


    return (
        "Integral propia"
    )


def _crear_motivo(
    inferior,
    superior,
    singularidades,
    tipo
):

    if (
        tipo
        ==
        "Integral impropia mixta"
    ):

        return (
            "La integral combina un intervalo no acotado "
            "con una o más discontinuidades."
        )


    if (
        tipo
        ==
        "Intervalo no acotado en ambos extremos"
    ):

        return (
            "Los dos extremos del intervalo de integración "
            "son infinitos."
        )


    if (
        tipo
        ==
        "Intervalo no acotado hacia +∞"
    ):

        return (
            "El límite superior de integración es infinito."
        )


    if (
        tipo
        ==
        "Intervalo no acotado hacia -∞"
    ):

        return (
            "El límite inferior de integración es menos infinito."
        )


    if (
        tipo
        ==
        "Discontinuidad dentro del intervalo"
    ):

        return (
            "La función presenta una discontinuidad dentro "
            "del intervalo de integración."
        )


    if (
        tipo
        ==
        "Discontinuidad en ambos extremos"
    ):

        return (
            "La función presenta discontinuidades en ambos "
            "extremos del intervalo."
        )


    if (
        tipo
        ==
        "Discontinuidad en un extremo"
    ):

        return (
            "La función presenta una discontinuidad en uno "
            "de los extremos del intervalo."
        )


    return (
        "La función es continua sobre un intervalo finito."
    )


def _crear_fronteras(
    inferior,
    superior,
    singularidades
):

    puntos = [

        inferior,

        *singularidades,

        superior
    ]


    fronteras = []


    for punto in puntos:

        if (
            not fronteras
        ):

            fronteras.append(
                punto
            )

            continue


        if (
            _son_iguales(
                fronteras[-1],
                punto
            )
        ):

            continue


        fronteras.append(
            punto
        )


    if (
        inferior == -sp.oo
        and
        superior == sp.oo
        and
        len(
            singularidades
        ) == 0
    ):

        fronteras = [

            -sp.oo,

            sp.Integer(
                0
            ),

            sp.oo
        ]


    return fronteras


def _es_singularidad(
    valor,
    singularidades
):

    return any(

        _son_iguales(
            valor,
            punto
        )

        for punto
        in singularidades
    )


def _estado_resultado(
    resultado
):

    if (
        resultado
        is
        None
    ):

        return (
            "indeterminado"
        )


    try:

        if (
            resultado.has(
                sp.Integral,
                sp.Limit
            )
        ):

            return (
                "indeterminado"
            )

    except Exception:

        pass


    try:

        if (
            resultado.has(
                sp.oo,
                -sp.oo,
                sp.zoo,
                sp.nan
            )
        ):

            return (
                "divergente"
            )

    except Exception:

        pass


    try:

        if (
            resultado.has(
                sp.AccumBounds
            )
        ):

            return (
                "divergente"
            )

    except Exception:

        pass


    try:

        if (
            resultado.is_finite
            is
            False
        ):

            return (
                "divergente"
            )

    except Exception:

        pass


    return (
        "convergente"
    )


def _evaluar_antiderivada_en_extremo(
    antiderivada,
    extremo,
    lado,
    es_problematico
):

    if (
        extremo == sp.oo
    ):

        return sp.limit(
            antiderivada,
            x,
            sp.oo
        )


    if (
        extremo == -sp.oo
    ):

        return sp.limit(
            antiderivada,
            x,
            -sp.oo
        )


    if (
        es_problematico
    ):

        return sp.limit(
            antiderivada,
            x,
            extremo,
            dir=lado
        )


    return sp.simplify(
        antiderivada.subs(
            x,
            extremo
        )
    )


def _evaluar_tramo(
    funcion,
    inferior,
    superior,
    singularidades
):

    funcion_real = (
        _convertir_potencias_racionales_reales(
            funcion
        )
    )


    try:

        resultado_directo = sp.integrate(
            funcion_real,
            (
                x,
                inferior,
                superior
            )
        )


        resultado_directo = sp.simplify(
            resultado_directo
        )


        estado_directo = _estado_resultado(
            resultado_directo
        )


        if (
            estado_directo
            !=
            "indeterminado"
        ):

            return {

                "estado":
                    estado_directo,

                "resultado":
                    resultado_directo,

                "metodo":
                    "integracion_directa"
            }

    except Exception:

        pass


    try:

        antiderivada = sp.integrate(
            funcion_real,
            x
        )


        if (
            antiderivada.has(
                sp.Integral
            )
        ):

            return {

                "estado":
                    "indeterminado",

                "resultado":
                    None,

                "metodo":
                    "sin_antiderivada"
            }


        inferior_problematico = (

            inferior == -sp.oo

            or

            _es_singularidad(
                inferior,
                singularidades
            )
        )


        superior_problematico = (

            superior == sp.oo

            or

            _es_singularidad(
                superior,
                singularidades
            )
        )


        valor_inferior = (
            _evaluar_antiderivada_en_extremo(
                antiderivada,
                inferior,
                "+",
                inferior_problematico
            )
        )


        valor_superior = (
            _evaluar_antiderivada_en_extremo(
                antiderivada,
                superior,
                "-",
                superior_problematico
            )
        )


        resultado = sp.simplify(
            valor_superior
            -
            valor_inferior
        )


        estado = _estado_resultado(
            resultado
        )


        return {

            "estado":
                estado,

            "resultado":
                resultado,

            "metodo":
                "limite_antiderivada"
        }


    except Exception:

        return {

            "estado":
                "indeterminado",

            "resultado":
                None,

            "metodo":
                "fallo_simbolico"
        }


def _latex_extremo(valor):

    if (
        valor == sp.oo
    ):

        return "\\infty"


    if (
        valor == -sp.oo
    ):

        return "-\\infty"


    return sp.latex(
        valor
    )


def _texto_extremo(valor):

    if (
        valor == sp.oo
    ):

        return "inf"


    if (
        valor == -sp.oo
    ):

        return "-inf"


    return str(
        sp.simplify(
            valor
        )
    )


def _integral_latex(
    funcion,
    inferior,
    superior
):

    return (

        "\\int_{"

        +

        _latex_extremo(
            inferior
        )

        +

        "}^{"

        +

        _latex_extremo(
            superior
        )

        +

        "}"

        +

        sp.latex(
            funcion
        )

        +

        "\\,dx"
    )


def _primitiva_visual(
    funcion,
    funcion_real
):

    try:

        primitiva = sp.integrate(
            funcion,
            x
        )


        if (
            not primitiva.has(
                sp.Integral
            )
        ):

            return primitiva

    except Exception:

        pass


    try:

        return sp.integrate(
            funcion_real,
            x
        )

    except Exception:

        return sp.Integral(
            funcion,
            x
        )


def _elegir_punto_auxiliar(
    inferior,
    superior
):

    if (
        inferior != -sp.oo
        and
        superior != sp.oo
    ):

        return sp.simplify(
            (
                inferior
                +
                superior
            )
            /
            2
        )


    if (
        inferior != -sp.oo
        and
        superior == sp.oo
    ):

        return sp.simplify(
            inferior
            +
            1
        )


    if (
        inferior == -sp.oo
        and
        superior != sp.oo
    ):

        return sp.simplify(
            superior
            -
            1
        )


    return sp.Integer(
        0
    )


def _definicion_impropia_latex(
    funcion,
    inferior,
    superior,
    singularidades
):

    izquierda_problematica = (

        inferior == -sp.oo

        or

        _es_singularidad(
            inferior,
            singularidades
        )
    )


    derecha_problematica = (

        superior == sp.oo

        or

        _es_singularidad(
            superior,
            singularidades
        )
    )


    funcion_latex = sp.latex(
        funcion
    )


    if (
        izquierda_problematica
        and
        derecha_problematica
    ):

        c = _elegir_punto_auxiliar(
            inferior,
            superior
        )


        c_latex = sp.latex(
            c
        )


        if (
            inferior == -sp.oo
        ):

            izquierda = (

                "\\lim_{a\\to-\\infty}"

                +

                "\\int_{a}^{"

                +

                c_latex

                +

                "}"

                +

                funcion_latex

                +

                "\\,dx"
            )

        else:

            izquierda = (

                "\\lim_{a\\to "

                +

                sp.latex(
                    inferior
                )

                +

                "^{+}}"

                +

                "\\int_{a}^{"

                +

                c_latex

                +

                "}"

                +

                funcion_latex

                +

                "\\,dx"
            )


        if (
            superior == sp.oo
        ):

            derecha = (

                "\\lim_{b\\to\\infty}"

                +

                "\\int_{"

                +

                c_latex

                +

                "}^{b}"

                +

                funcion_latex

                +

                "\\,dx"
            )

        else:

            derecha = (

                "\\lim_{b\\to "

                +

                sp.latex(
                    superior
                )

                +

                "^{-}}"

                +

                "\\int_{"

                +

                c_latex

                +

                "}^{b}"

                +

                funcion_latex

                +

                "\\,dx"
            )


        return (
            izquierda
            +
            "+"
            +
            derecha
        )


    if (
        izquierda_problematica
    ):

        if (
            inferior == -sp.oo
        ):

            return (

                "\\lim_{a\\to-\\infty}"

                +

                "\\int_{a}^{"

                +

                _latex_extremo(
                    superior
                )

                +

                "}"

                +

                funcion_latex

                +

                "\\,dx"
            )


        return (

            "\\lim_{a\\to "

            +

            sp.latex(
                inferior
            )

            +

            "^{+}}"

            +

            "\\int_{a}^{"

            +

            _latex_extremo(
                superior
            )

            +

            "}"

            +

            funcion_latex

            +

            "\\,dx"
        )


    if (
        derecha_problematica
    ):

        if (
            superior == sp.oo
        ):

            return (

                "\\lim_{b\\to\\infty}"

                +

                "\\int_{"

                +

                _latex_extremo(
                    inferior
                )

                +

                "}^{b}"

                +

                funcion_latex

                +

                "\\,dx"
            )


        return (

            "\\lim_{b\\to "

            +

            sp.latex(
                superior
            )

            +

            "^{-}}"

            +

            "\\int_{"

            +

            _latex_extremo(
                inferior
            )

            +

            "}^{b}"

            +

            funcion_latex

            +

            "\\,dx"
        )


    return _integral_latex(
        funcion,
        inferior,
        superior
    )


def _evaluacion_primitiva_latex(
    primitiva,
    inferior,
    superior,
    singularidades
):

    f_latex = sp.latex(
        primitiva
    )


    izquierda_problematica = (

        inferior == -sp.oo

        or

        _es_singularidad(
            inferior,
            singularidades
        )
    )


    derecha_problematica = (

        superior == sp.oo

        or

        _es_singularidad(
            superior,
            singularidades
        )
    )


    if (
        izquierda_problematica
        and
        derecha_problematica
    ):

        c = _elegir_punto_auxiliar(
            inferior,
            superior
        )


        c_latex = sp.latex(
            c
        )


        if (
            inferior == -sp.oo
        ):

            izquierda = (

                "\\lim_{a\\to-\\infty}"

                +

                "\\left["

                +

                f_latex

                +

                "\\right]_{a}^{"

                +

                c_latex

                +

                "}"
            )

        else:

            izquierda = (

                "\\lim_{a\\to "

                +

                sp.latex(
                    inferior
                )

                +

                "^{+}}"

                +

                "\\left["

                +

                f_latex

                +

                "\\right]_{a}^{"

                +

                c_latex

                +

                "}"
            )


        if (
            superior == sp.oo
        ):

            derecha = (

                "\\lim_{b\\to\\infty}"

                +

                "\\left["

                +

                f_latex

                +

                "\\right]_{"

                +

                c_latex

                +

                "}^{b}"
            )

        else:

            derecha = (

                "\\lim_{b\\to "

                +

                sp.latex(
                    superior
                )

                +

                "^{-}}"

                +

                "\\left["

                +

                f_latex

                +

                "\\right]_{"

                +

                c_latex

                +

                "}^{b}"
            )


        return (
            izquierda
            +
            "+"
            +
            derecha
        )


    if (
        izquierda_problematica
    ):

        if (
            inferior == -sp.oo
        ):

            return (

                "\\lim_{a\\to-\\infty}"

                +

                "\\left["

                +

                f_latex

                +

                "\\right]_{a}^{"

                +

                _latex_extremo(
                    superior
                )

                +

                "}"
            )


        return (

            "\\lim_{a\\to "

            +

            sp.latex(
                inferior
            )

            +

            "^{+}}"

            +

            "\\left["

            +

            f_latex

            +

            "\\right]_{a}^{"

            +

            _latex_extremo(
                superior
            )

            +

            "}"
        )


    if (
        derecha_problematica
    ):

        if (
            superior == sp.oo
        ):

            return (

                "\\lim_{b\\to\\infty}"

                +

                "\\left["

                +

                f_latex

                +

                "\\right]_{"

                +

                _latex_extremo(
                    inferior
                )

                +

                "}^{b}"
            )


        return (

            "\\lim_{b\\to "

            +

            sp.latex(
                superior
            )

            +

            "^{-}}"

            +

            "\\left["

            +

            f_latex

            +

            "\\right]_{"

            +

            _latex_extremo(
                inferior
            )

            +

            "}^{b}"
        )


    return (

        "\\left["

        +

        f_latex

        +

        "\\right]_{"

        +

        _latex_extremo(
            inferior
        )

        +

        "}^{"

        +

        _latex_extremo(
            superior
        )

        +

        "}"
    )


def _crear_partes(
    funcion,
    primitiva,
    detalles_tramos,
    singularidades
):

    partes = []


    for indice, detalle in enumerate(
        detalles_tramos,
        start=1
    ):

        inferior = detalle[
            "inferior"
        ]


        superior = detalle[
            "superior"
        ]


        estado = detalle[
            "estado"
        ]


        resultado = detalle[
            "resultado"
        ]


        definicion_latex = (
            _definicion_impropia_latex(
                funcion,
                inferior,
                superior,
                singularidades
            )
        )


        evaluacion_primitiva = (
            _evaluacion_primitiva_latex(
                primitiva,
                inferior,
                superior,
                singularidades
            )
        )


        if (
            resultado is not None
        ):

            resultado_latex = sp.latex(
                sp.simplify(
                    resultado
                )
            )


            resultado_texto = str(
                sp.simplify(
                    resultado
                )
            )

        else:

            resultado_latex = None

            resultado_texto = None


        if (
            estado == "convergente"
            and
            resultado_latex
            is not None
        ):

            evaluacion_latex = (

                evaluacion_primitiva

                +

                "="

                +

                resultado_latex
            )


        elif (
            estado == "divergente"
        ):

            evaluacion_latex = (

                evaluacion_primitiva

                +

                "\\Longrightarrow"

                +

                "\\text{Divergente}"
            )


        else:

            evaluacion_latex = (

                evaluacion_primitiva

                +

                "\\Longrightarrow"

                +

                "\\text{No determinado}"
            )


        partes.append(
            {

                "numero":
                    indice,

                "desde":
                    _texto_extremo(
                        inferior
                    ),

                "hasta":
                    _texto_extremo(
                        superior
                    ),

                "definicion_latex":
                    definicion_latex,

                "evaluacion_primitiva_latex":
                    evaluacion_primitiva,

                "evaluacion_latex":
                    evaluacion_latex,

                "resultado":
                    resultado_texto,

                "resultado_latex":
                    resultado_latex,

                "estado":
                    estado,

                "metodo":
                    detalle[
                        "metodo"
                    ]
            }
        )


    return partes


def _crear_procedimiento_detallado(
    funcion,
    primitiva,
    inferior,
    superior,
    singularidades,
    tipo,
    clasificacion,
    resultado,
    detalles_tramos,
    partes
):

    procedimiento = []


    procedimiento.append(
        {

            "titulo":
                "1. Identificar por qué la integral es impropia",

            "texto":
                (
                    "Se revisa el intervalo de integración y los "
                    "puntos donde la función deja de estar definida. "
                    f"Clasificación: {tipo}."
                ),

            "latex":
                _integral_latex(
                    funcion,
                    inferior,
                    superior
                )
        }
    )


    if (
        singularidades
    ):

        puntos = ",\\;".join(

            sp.latex(
                punto
            )

            for punto
            in singularidades
        )


        procedimiento.append(
            {

                "titulo":
                    "2. Localizar el punto problemático",

                "texto":
                    (
                        "Los puntos donde la función no está definida "
                        "deben separar la integral en regiones "
                        "independientes."
                    ),

                "latex":
                    (
                        "x="
                        +
                        puntos
                    )
            }
        )


    elif (
        inferior == -sp.oo
        or
        superior == sp.oo
    ):

        procedimiento.append(
            {

                "titulo":
                    "2. Identificar el extremo infinito",

                "texto":
                    (
                        "El infinito no se sustituye directamente. "
                        "Debe reemplazarse mediante un límite."
                    ),

                "latex":
                    _integral_latex(
                        funcion,
                        inferior,
                        superior
                    )
            }
        )


    else:

        procedimiento.append(
            {

                "titulo":
                    "2. Verificar continuidad",

                "texto":
                    (
                        "No se detectaron puntos problemáticos "
                        "dentro del intervalo."
                    ),

                "latex":
                    "\\text{La función es continua en el intervalo.}"
            }
        )


    if (
        len(
            detalles_tramos
        )
        >
        1
    ):

        suma_integrales = " + ".join(

            _integral_latex(
                funcion,
                tramo[
                    "inferior"
                ],
                tramo[
                    "superior"
                ]
            )

            for tramo
            in detalles_tramos
        )


        procedimiento.append(
            {

                "titulo":
                    "3. Separar la integral",

                "texto":
                    (
                        "La integral original se divide en cada "
                        "punto problemático, igual que en el "
                        "procedimiento utilizado en clase."
                    ),

                "latex":
                    (
                        _integral_latex(
                            funcion,
                            inferior,
                            superior
                        )

                        +

                        "="

                        +

                        suma_integrales
                    )
            }
        )


    else:

        procedimiento.append(
            {

                "titulo":
                    "3. Escribir la definición mediante un límite",

                "texto":
                    (
                        "La integral impropia se transforma en "
                        "un límite antes de evaluarla."
                    ),

                "latex":
                    partes[
                        0
                    ][
                        "definicion_latex"
                    ]
            }
        )


    if (
        len(
            partes
        )
        >
        1
    ):

        definiciones = []


        for indice, parte in enumerate(
            partes,
            start=1
        ):

            definiciones.append(

                "I_{"

                +

                str(
                    indice
                )

                +

                "}"

                +

                "="

                +

                parte[
                    "definicion_latex"
                ]
            )


        procedimiento.append(
            {

                "titulo":
                    "4. Convertir cada tramo en un límite",

                "texto":
                    (
                        "Cada lado de una discontinuidad debe "
                        "estudiarse por separado mediante límites "
                        "laterales."
                    ),

                "latex":
                    "\\qquad ".join(
                        definiciones
                    )
            }
        )


    else:

        procedimiento.append(
            {

                "titulo":
                    "4. Plantear el límite correspondiente",

                "texto":
                    (
                        "Se conserva únicamente el tramo necesario "
                        "y se analiza su límite."
                    ),

                "latex":
                    partes[
                        0
                    ][
                        "definicion_latex"
                    ]
            }
        )


    procedimiento.append(
        {

            "titulo":
                "5. Obtener una antiderivada",

            "texto":
                (
                    "Se integra la función para poder evaluar "
                    "posteriormente los extremos mediante límites."
                ),

            "latex":
                (
                    "F(x)="
                    +
                    sp.latex(
                        primitiva
                    )
                )
        }
    )


    evaluaciones = []


    for indice, parte in enumerate(
        partes,
        start=1
    ):

        evaluaciones.append(

            "I_{"

            +

            str(
                indice
            )

            +

            "}"

            +

            "="

            +

            parte[
                "evaluacion_latex"
            ]
        )


    procedimiento.append(
        {

            "titulo":
                "6. Evaluar cada tramo",

            "texto":
                (
                    "Se sustituye la antiderivada dentro de cada "
                    "límite. Cada tramo debe producir un valor "
                    "finito para que la integral completa converja."
                ),

            "latex":
                "\\qquad ".join(
                    evaluaciones
                )
        }
    )


    if (
        clasificacion == "convergente"
    ):

        resultados = [

            parte[
                "resultado_latex"
            ]

            for parte
            in partes

            if (
                parte[
                    "resultado_latex"
                ]
                is not None
            )
        ]


        if (
            len(
                resultados
            )
            >
            1
        ):

            suma = " + ".join(

                "("

                +

                valor

                +

                ")"

                for valor
                in resultados
            )


            latex_final = (

                "I="

                +

                suma

                +

                "="

                +

                sp.latex(
                    resultado
                )

                +

                "\\qquad"

                +

                "\\boxed{\\text{Convergente}}"
            )

        else:

            latex_final = (

                "I="

                +

                sp.latex(
                    resultado
                )

                +

                "\\qquad"

                +

                "\\boxed{\\text{Convergente}}"
            )


        procedimiento.append(
            {

                "titulo":
                    "7. Sumar los resultados y concluir",

                "texto":
                    (
                        "Todos los límites existen y son finitos. "
                        "Por ello se suman los resultados de los "
                        "tramos y la integral es convergente."
                    ),

                "latex":
                    latex_final
            }
        )


    elif (
        clasificacion == "divergente"
    ):

        procedimiento.append(
            {

                "titulo":
                    "7. Conclusión",

                "texto":
                    (
                        "Al menos uno de los límites no produce "
                        "un valor finito. Basta con que un tramo "
                        "diverja para que la integral completa "
                        "también diverja."
                    ),

                "latex":
                    "\\boxed{\\text{La integral es divergente}}"
            }
        )


    else:

        procedimiento.append(
            {

                "titulo":
                    "7. Conclusión",

                "texto":
                    (
                        "El motor simbólico no logró determinar "
                        "de forma segura todos los límites."
                    ),

                "latex":
                    "\\boxed{\\text{Resultado indeterminado}}"
            }
        )


    return procedimiento


def analizar_integral(
    funcion,
    limite_inferior,
    limite_superior
):

    funcion = sp.simplify(
        funcion
    )


    funcion_real = (
        _convertir_potencias_racionales_reales(
            funcion
        )
    )


    inferior = sp.sympify(
        limite_inferior
    )


    superior = sp.sympify(
        limite_superior
    )


    if (
        inferior != -sp.oo
        and
        superior != sp.oo
    ):

        try:

            if (
                float(
                    sp.N(
                        inferior
                    )
                )
                >
                float(
                    sp.N(
                        superior
                    )
                )
            ):

                inferior, superior = (
                    superior,
                    inferior
                )

        except Exception:

            pass


    primitiva_simbolica = (
        _primitiva_visual(
            funcion,
            funcion_real
        )
    )


    primitiva = str(
        primitiva_simbolica
    )


    primitiva_latex = sp.latex(
        primitiva_simbolica
    )


    singularidades = obtener_singularidades(
        funcion,
        inferior,
        superior
    )


    tipo = _clasificar_tipo(
        inferior,
        superior,
        singularidades
    )


    motivo = _crear_motivo(
        inferior,
        superior,
        singularidades,
        tipo
    )


    fronteras = _crear_fronteras(
        inferior,
        superior,
        singularidades
    )


    detalles_tramos = []


    estados_encontrados = []


    resultados_convergentes = []


    for indice in range(
        len(
            fronteras
        )
        -
        1
    ):

        a = fronteras[
            indice
        ]


        b = fronteras[
            indice + 1
        ]


        evaluacion = _evaluar_tramo(
            funcion,
            a,
            b,
            singularidades
        )


        detalles_tramos.append(
            {

                "inferior":
                    a,

                "superior":
                    b,

                "estado":
                    evaluacion[
                        "estado"
                    ],

                "resultado":
                    evaluacion[
                        "resultado"
                    ],

                "metodo":
                    evaluacion[
                        "metodo"
                    ]
            }
        )


        estados_encontrados.append(
            evaluacion[
                "estado"
            ]
        )


        if (
            evaluacion[
                "estado"
            ]
            ==
            "convergente"
            and
            evaluacion[
                "resultado"
            ]
            is not None
        ):

            resultados_convergentes.append(
                evaluacion[
                    "resultado"
                ]
            )


    if (
        "divergente"
        in
        estados_encontrados
    ):

        estado_global = (
            "divergente"
        )


        resultado_total = None


    elif (
        "indeterminado"
        in
        estados_encontrados
    ):

        estado_global = (
            "indeterminado"
        )


        resultado_total = None


    else:

        estado_global = (
            "convergente"
        )


        resultado_total = sp.simplify(

            sum(

                resultados_convergentes,

                sp.Integer(
                    0
                )
            )
        )


    partes = _crear_partes(
        funcion,
        primitiva_simbolica,
        detalles_tramos,
        singularidades
    )


    procedimiento = (
        _crear_procedimiento_detallado(
            funcion,
            primitiva_simbolica,
            inferior,
            superior,
            singularidades,
            tipo,
            estado_global,
            resultado_total,
            detalles_tramos,
            partes
        )
    )


    singularidades_texto = [

        str(
            sp.simplify(
                punto
            )
        )

        for punto
        in singularidades
    ]


    singularidades_latex = [

        sp.latex(
            sp.simplify(
                punto
            )
        )

        for punto
        in singularidades
    ]


    resultado_latex = None


    if (
        resultado_total
        is not None
    ):

        resultado_latex = sp.latex(
            resultado_total
        )


    advertencia = None


    if (
        estado_global
        ==
        "indeterminado"
    ):

        advertencia = (
            "El motor simbólico no pudo determinar de forma "
            "segura la convergencia de esta integral."
        )


    if (
        estado_global
        ==
        "divergente"
    ):

        advertencia = (
            "La integral es divergente porque al menos uno "
            "de sus tramos no converge."
        )


    return {

        "tipo":
            tipo,

        "motivo":
            motivo,

        "singularidades":
            singularidades_texto,

        "singularidades_latex":
            singularidades_latex,

        "primitiva":
            primitiva,

        "primitiva_latex":
            primitiva_latex,

        "clasificacion":
            estado_global,

        "resultado":
            resultado_total,

        "resultado_latex":
            resultado_latex,

        "integral_latex":
            _integral_latex(
                funcion,
                inferior,
                superior
            ),

        "funcion_latex":
            sp.latex(
                funcion
            ),

        "partes":
            partes,

        "tramos":
            detalles_tramos,

        "procedimiento":
            procedimiento,

        "advertencia":
            advertencia
    }