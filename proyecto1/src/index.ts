import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

import taller1Routes from './talleres/taller1/taller1.routes'
import taller2Routes from './talleres/taller2/taller2.routes'
import taller3Routes from './talleres/taller3/taller3.routes'

const app = express()
const PORT = 3000

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'api de talleres - desarrollo web backend',
            version: '1.0.0',
            description: 'documentacion de la api de los talleres de la clase jeje',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'servidor de desarrollo local'
            }
        ]
    },
    apis: ['./src/talleres/**/*.ts'], 
}

const swaggerSpecs = swaggerJsdoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('api de talleres funcionando')
})

app.use('/taller1', taller1Routes)
app.use('/taller2', taller2Routes)
app.use('/taller3', taller3Routes)

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
    console.log(`documentacion de api disponible en http://localhost:${PORT}/api-docs`)
})