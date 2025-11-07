import { Router, Request, Response } from 'express'
import { convertidorTemp, resolverdor, mejorParidad, peorParidad } from './taller1.logic'

const router = Router()

/**
 * @openapi
 * /taller1/convertidor-temp:
 *   post:
 *     tags: [Taller 1]
 *     summary: convierte grados celsius a farenheit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gradosC:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: conversion exitosa
 */
router.post('/convertidor-temp', (req: Request, res: Response) => {
    const { gradosC } = req.body
    if (gradosC === undefined || typeof gradosC !== 'number') {
        return res.status(400).json({ error: 'El parametro "gradosC" es requerido y debe ser un numero' })
    }
    const resultado = convertidorTemp(gradosC)
    res.json({ resultado: `${gradosC}°C son ${resultado}°F` })
})

/**
 * @openapi
 * /taller1/resolvdor:
 *   post:
 *     tags: [Taller 1]
 *     summary: resuelve una ecuacion cuadratica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               a:
 *                 type: number
 *                 example: 1
 *               b:
 *                 type: number
 *                 example: -3
 *               c:
 *                 type: number
 *                 example: 2
 *               eleccion:
 *                 type: number
 *                 description: 1 para la raiz positiva, otro numero para la negativa
 *                 example: 1
 *     responses:
 *       200:
 *         description: calculo exitoso
 */
router.post('/resolvedor', (req: Request, res: Response) => {
    const { a, b, c, eleccion } = req.body
    if ([a, b, c, eleccion].some(val => typeof val !== 'number')) {
        return res.status(400).json({ error: 'Los parmetros a, b, c y eleccion son requeridos y deben ser numeros.' })
    }
    const resultado = resolverdor(a, b, c, eleccion)
    res.json({ resultado })
})

/**
 * @openapi
 * /taller1/mejor-paridad:
 *   post:
 *     tags: [Taller 1]
 *     summary: verifica si un numero es par
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: verificacion exitosa
 */
router.post('/mejor-paridad', (req: Request, res: Response) => {
    const { num } = req.body
    if (typeof num !== 'number') {
        return res.status(400).json({ error: 'El parametro "num" es requerido y debe ser un nimero' })
    }
    const resultado = mejorParidad(num)
    res.json({ esPar: resultado })
})

/**
 * @openapi
 * /taller1/peor-paridad:
 *   post:
 *     tags: [Taller 1]
 *     summary: verifica si un numero es par
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: verificacion exitosa
 */
router.post('/peor-paridad', (req: Request, res: Response) => {
    const { num } = req.body
    if (typeof num !== 'number') {
        return res.status(400).json({ error: 'El parametro "num" es requerido y debe ser un numero' })
    }
    const resultado = peorParidad(num)
    res.json({ esPar: resultado })
})

export default router