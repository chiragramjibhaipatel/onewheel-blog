import {prisma} from "~/db.server"

export async function getPostListings(){
    return await prisma.post.findMany({
        select: {slug:true  , title: true}
    })
}

export async function getPosts() {

    return await prisma.post.findMany();
    
}