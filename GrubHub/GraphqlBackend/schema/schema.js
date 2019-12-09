const graphql = require('graphql');
const _ = require('lodash');
var Owner = require('../Models/owner')
var Buyer = require('../Models/buyer')
var Section = require('../Models/section')
var Item = require('../Models/items')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const ObjectId = require('mongoose').Types.ObjectId;

ObjectId.prototype.valueOf = function () {
    return this.toString();
};

// dummy data
var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];

var sections = []

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return _.find(authors, { id: parent.authorId });
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, { authorId: parent.id });
            }
        }
    })
});


const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        restaurantname: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const SectionType = new GraphQLObjectType({
    name: 'Section',
    fields: () => ({
        _id: { type: GraphQLString },
        sectionname: { type: GraphQLString },
        ownername: { type: GraphQLString }
    })
});


const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        // _id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLString },
        sectionname: { type: GraphQLString },
        owneremail: { type: GraphQLString },
        restaurantname: { type: GraphQLString },
        cuisine: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        },
        getOwnerProfile: {
            type: new GraphQLList(OwnerType),
            args: {
                email: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log("In fetch owner profile")
                return await Owner.find({ "email": args.email })
            }
        },

        getOwnerSection: {
            type: new GraphQLList(SectionType),
            args: {
                ownername: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log("In fetch owner section" + args.ownername)
                sections = await Section.find({ "ownername": args.ownername })
                return sections
            }
        },

        getSectionDetails: {
            type: new GraphQLList(ItemType),
            args: {
                ownername: {
                    type: GraphQLString
                },
                sectionname: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log("In fetch getSectionDetails" + args.ownername + args.sectionname + " sectionname")
                return await Item.find({ "owneremail": args.ownername, "sectionname": args.sectionname })

            }
        },
    }
});

var count = 10;
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                let author = {
                    name: args.name,
                    age: args.age,
                    id: args.id
                };
                authors.push(author)
                console.log("Authors", authors);
                return author;
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let book = {
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                    id: count++
                }
                books.push(book);
                return book;
            }
        },

        ownerSignup: {
            type: OwnerType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                restaurant: { type: GraphQLString },
                cuisine: { type: GraphQLString }
            },
            async resolve(parent, args) {
                console.log("Inside mutation")

                let obj = {
                    name: args.name,
                    email: args.email,
                    phone: "",
                    password: args.password,
                    restaurantname: args.restaurant,
                    cuisine: args.cuisine
                }

                let owner = new Owner(obj)
                var doc = await owner.save()
                return doc
            }
        },

        login: {
            type: OwnerType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                radio: { type: GraphQLString },
            },
            async resolve(parent, args) {
                console.log("inside logi n resol")
                console.log(JSON.stringify(args))
                if (args.radio === "owner") {
                    console.log("isdie owner")
                    var doc = await Owner.findOne({ email: args.email })
                    if (args.password === doc.password) {
                        return doc
                    } else {
                        return "Invalid Credentials"
                    }
                } else {
                    console.log("inside buyer")
                    var doc = await Buyer.findOne({ email: args.email })
                    if (args.password === doc.password) {
                        return doc
                    } else {
                        return "Invalid Credentials"
                    }
                }
            }
        },

        updateOwner: {
            type: OwnerType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                restaurantname: { type: GraphQLString },
                cuisine: { type: GraphQLString }
            },
            async resolve(parent, args) {
                console.log("Inside mutation update owner")

                var doc = await Owner.findOneAndUpdate({ email: args.email }, { $set: { name: args.name, phone: args.phone, restaurantname: args.restaurantname, cuisine: args.cuisine } })
                return doc
            }
        },

        addSection: {
            type: SectionType,
            args: {
                sectionname: { type: GraphQLString },
                ownername: { type: GraphQLString }
            },
            async resolve(parent, args) {
                console.log("Inside mutation addSection")
                var obj = {
                    sectionname: args.sectionname,
                    ownername: args.ownername
                }

                var section = new Section(obj)
                var doc = await section.save()
                return doc
            }
        },

        addItem: {
            type: ItemType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLString },
                sectionname: { type: GraphQLString },
                owneremail: { type: GraphQLString },
                restaurantname: { type: GraphQLString },
                cuisine: { type: GraphQLString }
            },
            async resolve(parent, args) {
                console.log("Inside mutation addItem")
                var obj = {
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    sectionname: args.sectionname,
                    owneremail: args.owneremail,
                    restaurantname: args.restaurantname,
                    cuisine: args.cuisine
                }

                var item = new Item(obj)
                var doc = await item.save()
                return doc
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});