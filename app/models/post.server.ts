import type { Post } from "@prisma/client";
import {prisma} from "~/db.server"

export async function getPostListings(){
    return await prisma.post.findMany({
        select: {slug:true  , title: true}
    })
}

export async function getPosts() {

    return await prisma.post.findMany();
    
}

export async function getPost(slug: string) {
    console.log("getPost", slug);
    
    const newLocal = await prisma.post.findUnique({ where: { slug } });
    console.log(newLocal);
    
    return newLocal


}

export async function createPost(post: Pick<Post, 'slug' | 'title' | 'markdown'>) {
    return await prisma.post.create({data: post})
    
    
}

export async function updatePost(slug: string, post: Pick<Post, 'slug' | 'title' | 'markdown'>) {
    return await prisma.post.update({data: post, where: {slug}})
    
    
}

export async function deletePost(slug: string) {
    return await prisma.post.delete({where: {slug}})
    
    
}