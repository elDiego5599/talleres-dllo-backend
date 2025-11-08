import { Router, Request, Response } from 'express'
import { desglosarString, twoSum, conversionRomana, descomposicion } from './taller3.logic'

const router = Router()

/**
 * @openapi
 * /taller3/desglosar-string:
 *   post:
 *     tags: [Taller 3]
 *     summary: Cuenta vocales o consonantes en una palabra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               palabra:
 *                 type: string
 *                 example: "HolaMundo"
 *               tipo:
 *                 type: string
 *                 description: Escribir "vocales" para contar vocales, cualquier otra cosa para consonantes
 *                 example: "vocales"
 *     responses:
 *       200:
 *         description: conteo realizado jeje
 */
router.post('/desglosar-string', (req: Request, res: Response) => {
    const { palabra, tipo } = req.body
    const resultado = desglosarString(palabra, tipo)
    res.json({ conteo: resultado })
})

/**
 * @openapi
 * /taller3/two-sum:
 *   post:
 *     tags: [Taller 3]
 *     summary: encuentra dos indices en una lista cuya suma es igual a un numero objetivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lista:
 *                 type: array
 *                 items: { type: number }
 *                 example: [2, 7, 11, 15]
 *               entero:
 *                 type: number
 *                 example: 9
 *     responses:
 *       200:
 *         description: indices encontrados
 */
router.post('/two-sum', (req: Request, res: Response) => {
    const { lista, entero } = req.body
    const resultado = twoSum(lista, entero)
    res.json({ indices: resultado })
})

/**
 * @openapi
 * /taller3/conversion-romana:
 *   post:
 *     tags: [Taller 3]
 *     summary: convierte un numero romano a un numero entero
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               romano:
 *                 type: string
 *                 example: "MCMXCIV"
 *     responses:
 *       200:
 *         description: conversion exitosa
 */
router.post('/conversion-romana', (req: Request, res: Response) => {
    const { romano } = req.body
    const resultado = conversionRomana(romano)
    res.json({ numero: resultado })
})

/**
 * @openapi
 * /taller3/descomposicion:
 *   post:
 *     tags: [Taller 3]
 *     summary: Descompone una palabra en dos partes que existen en un diccionario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               texto:
 *                 type: string
 *                 description: String separado por comas. El primer elemento es la palabra los siguientes son el diccionario
 *                 example: "applepen,apple,pen"
 *     responses:
 *       200:
 *         description: decomposicion encontrada
 */
router.post('/descomposicion', (req: Request, res: Response) => {
    const { texto } = req.body
    const resultado = descomposicion(texto)
    res.json({ partes: resultado })
})

export default router