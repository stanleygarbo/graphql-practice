const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString , GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');

const app = express();

const brands = [
    {id:1, name: 'Jollibee'},
    {id:2, name: 'Chowking'},
];

const products = [
    {id:1, name: 'chaopan', brandId: 2},
    {id:2, name: 'sisig', brandId: 2},
    {id:3, name: 'steak', brandId: 1},
    {id:4, name: 'tinuwa', brandId: 2},
    {id:5, name: 'pansit', brandId: 1},
];

const BrandType =  new GraphQLObjectType({
    name: 'Brand',
    description: 'This represents a brand',
    fields:() => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
    })
});

const ProductType =  new GraphQLObjectType({
    name: 'Product',
    description: 'This represents a product by a brand',
    fields:() => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
        brandId: { type: GraphQLNonNull(GraphQLInt)},
        brand:{
            type: BrandType,
            resolve:(products)=>{
                return brands.find(brand=> brand.id === products.brandId)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'query',
    description: 'Root Query',
    fields: () => ({
        products:{
            type: new GraphQLList(ProductType),
            description: 'List of Products',
            resolve: () => products 
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql',graphqlHTTP({
    schema: schema,
    graphiql: true
}));

// console.log(expressGraphQL)

app.listen(5000,()=>console.log('listening to port 5000'));