from typing import Any

import sympy as sp

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.parser_matematico import (
    parsear_funcion,
    interpretar_limite
)

from core.analizador import (
    analizar_integral
)


app = FastAPI(
    title="Integrales Impropias API",
    version="2.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class IntegralRequest(BaseModel):

    funcion: str

    limite_inferior: str

    limite_superior: str


def serializar_sympy(
    valor: Any
):

    if valor is None:

        return None


    if isinstance(
        valor,
        dict
    ):

        return {

            str(clave):
                serializar_sympy(
                    contenido
                )

            for clave, contenido
            in valor.items()
        }


    if isinstance(
        valor,
        (
            list,
            tuple,
            set
        )
    ):

        return [

            serializar_sympy(
                elemento
            )

            for elemento
            in valor
        ]


    if isinstance(
        valor,
        sp.Basic
    ):

        return str(
            valor
        )


    if isinstance(
        valor,
        complex
    ):

        return {

            "real":
                valor.real,

            "imag":
                valor.imag
        }


    if isinstance(
        valor,
        (
            str,
            int,
            float,
            bool
        )
    ):

        return valor


    return str(
        valor
    )


def calcular_decimal(
    resultado
):

    if resultado is None:

        return None


    try:

        valor = sp.N(
            resultado,
            12
        )


        if (
            valor.is_real
            is
            False
        ):

            return None


        numero = float(
            valor
        )


        if (
            numero
            ==
            float("inf")
            or
            numero
            ==
            float("-inf")
        ):

            return None


        return numero


    except Exception:

        return None


@app.get("/")
def inicio():

    return {

        "ok":
            True,

        "mensaje":
            "API de Integrales Impropias funcionando"
    }


@app.post("/api/resolver")
def resolver_integral(
    datos: IntegralRequest
):

    try:

        funcion = parsear_funcion(
            datos.funcion
        )


        limite_inferior = (
            interpretar_limite(
                datos.limite_inferior
            )
        )


        limite_superior = (
            interpretar_limite(
                datos.limite_superior
            )
        )


        analisis = analizar_integral(
            funcion,
            limite_inferior,
            limite_superior
        )


        resultado_simbolico = (
            analisis.get(
                "resultado"
            )
        )


        resultado_decimal = (
            calcular_decimal(
                resultado_simbolico
            )
        )


        respuesta = {

            "ok":
                True,

            "funcion_original":
                datos.funcion,

            "funcion_sympy":
                str(
                    funcion
                ),

            "funcion_latex":
                analisis.get(
                    "funcion_latex",
                    sp.latex(
                        funcion
                    )
                ),

            "limite_inferior":
                str(
                    limite_inferior
                ),

            "limite_superior":
                str(
                    limite_superior
                ),

            "integral_latex":
                analisis.get(
                    "integral_latex"
                ),

            "tipo":
                analisis.get(
                    "tipo"
                ),

            "motivo":
                analisis.get(
                    "motivo"
                ),

            "clasificacion":
                analisis.get(
                    "clasificacion"
                ),

            "resultado":
                (
                    str(
                        resultado_simbolico
                    )
                    if
                    resultado_simbolico
                    is not None
                    else
                    None
                ),

            "resultado_latex":
                analisis.get(
                    "resultado_latex"
                ),

            "resultado_decimal":
                resultado_decimal,

            "singularidades":
                analisis.get(
                    "singularidades",
                    []
                ),

            "singularidades_latex":
                analisis.get(
                    "singularidades_latex",
                    []
                ),

            "primitiva":
                analisis.get(
                    "primitiva"
                ),

            "primitiva_latex":
                analisis.get(
                    "primitiva_latex"
                ),

            "partes":
                serializar_sympy(
                    analisis.get(
                        "partes",
                        []
                    )
                ),

            "tramos":
                serializar_sympy(
                    analisis.get(
                        "tramos",
                        []
                    )
                ),

            "procedimiento":
                serializar_sympy(
                    analisis.get(
                        "procedimiento",
                        []
                    )
                ),

            "advertencia":
                analisis.get(
                    "advertencia"
                )
        }


        return serializar_sympy(
            respuesta
        )


    except Exception as error:

        return {

            "ok":
                False,

            "error":
                str(
                    error
                )
        }