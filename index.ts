import fastify from 'fastify'
import Bottleneck from 'bottleneck'

const server = fastify()

const limiter = new Bottleneck({
    maxConcurrent: 1
})

async function pong_safely() {
    await delay(8000)
    return 'Pong'
}

server.get('/ping', async (request, reply) => {
    console.log('entered /ping ...')
    const result = await limiter.schedule(pong_safely)
    console.log(result)
    return {res: result}
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})

function delay(time: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, time))
}