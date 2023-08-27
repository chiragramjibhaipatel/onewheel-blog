import {prisma} from "~/db.server"

export async function getPostListings(){
    return await prisma.post.findMany({
        select: {slug:true  , title: true}
    })
}

export async function getPosts() {

    return await prisma.post.findMany();
    
}

export async function getPost(slug) {
    console.log("getPost", slug);
    
    const newLocal = await prisma.post.findUnique({ where: { slug } });
    console.log(newLocal);
    
    return newLocal


}

export async function createPost(post) {
    return await prisma.post.create({data: post})
    
    
}