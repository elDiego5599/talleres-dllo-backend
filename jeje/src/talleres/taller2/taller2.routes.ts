import { Router, Request, Response } from 'express'
import { findMax, includes, sum, missingNumbers, findMin } from './taller2.logic'

const router = Router()

/**
 * @openapi
 * /taller2/find-max:
 *   post:
 *     tags: [Taller 2]
 *     summary: encuentra el numero maximo en una lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lista:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 5, 2, 8, 3]
 *     responses:
 *       200:
 *         description: numero maximo encontrado
 */
router.post('/find-max', (req: Request, res: Response) => {
    const { lista } = req.body
    const resultado = findMax(lista)
    res.json({ maximo: resultado })
})

/**
 * @openapi
 * /taller2/includes:
 *   post:
 *     tags: [Taller 2]
 *     summary: Verifica si un numero esta incluido en una lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lista:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 5, 2, 8, 3]
 *               numero:
 *                 type: number
 *                 example: 8
 *     responses:
 *       200:
 *         description: verificacion completada
 */
router.post('/includes', (req: Request, res: Response) => {
    const { lista, numero } = req.body
    const resultado = includes(lista, numero)
    res.json({ incluido: resultado })
})

/**
 * @openapi
 * /taller2/sum:
 *   post:
 *     tags: [Taller 2]
 *     summary: Suma todos los numeros de una lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lista:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [10, 20, 30]
 *     responses:
 *       200:
 *         description: suma calculada
 */
router.post('/sum', (req: Request, res: Response) => {
    const { lista } = req.body
    const resultado = sum(lista)
    res.json({ suma: resultado })
})

/**
 * @openapi
 * /taller2/missing-numbers:
 *   post:
 *     tags: [Taller 2]
 *     summary: encuentra los numeros faltante en una secuencia dentro de una lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lista:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [1, 2, 5, 6, 9]
 *     responses:
 *       200:
 *         description: lista de numeros faltantes
 */
router.post('/missing-numbers', (req: Request, res: Response) => {
    const { lista } = req.body
    const resultado = missingNumbers(lista)
    res.json({ faltantes: resultado })
})

/**
 * @openapi
 * /taller2/find-min:
 *   post:
 *     tags: [Taller 2]
 *     summary: encuentra el numero minimo en una lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lista:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [10, 5, 2, 8, 3]
 *     responses:
 *       200:
 *         description: numero minimo encontrado
 */
router.post('/find-min', (req: Request, res: Response) => {
    const { lista } = req.body
    const resultado = findMin(lista)
    res.json({ minimo: resultado })
})

export default router