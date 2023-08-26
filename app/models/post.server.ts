import {prisma} from "~/db.server"


export async function getPosts() {

    return await prisma.post.findMany();
    
}