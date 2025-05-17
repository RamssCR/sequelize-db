import "express"

declare module "express" {
    export interface Request {
        user?: import('#@types/jsonwebtoken/index').DecodedToken
    }
}