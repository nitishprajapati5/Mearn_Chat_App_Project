import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

await prisma.$connect().then((res) => {
    console.log("Database Connected")
}).catch((error) => {
    console.log("Something went Wrong")
})

export default prisma;