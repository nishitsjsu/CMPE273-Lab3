
import { gql } from 'apollo-boost';

const addBookMutation = gql`
    mutation AddBook($name: String, $genre: String, $authorId: ID){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`;

const ownerSignupMutation = gql`
    mutation OwnerSignup($name: String, $email: String, $password: String, $restaurant: String, $cuisine: String){
        ownerSignup(name: $name, email: $email, password: $password, restaurant: $restaurant, cuisine: $cuisine){
            name
            email
        }
    }
`;

const buyerSignupMutation = gql`
    mutation BuyerSignup($name: String, $email: String, $password: String){
        buyerSignup(name: $name, email: $email, password: $password){
            name
            email
        }
    }
`;

const LoginMutation = gql`
    mutation login($email: String, $password: String, $radio : String){
        login(email: $email,password: $password, radio: $radio){
            email
            restaurantname
            cuisine
        }
    }
`;

const UpdateOwnerMutation = gql`
    mutation updateOwner($email: String, $name: String, $restaurantname : String, $cuisine : String, $phone : String){
        updateOwner(email: $email,name : $name, restaurantname: $restaurantname, cuisine: $cuisine, phone: $phone){
            email
        }
    }
`;

const AddSectionMutation = gql`
    mutation addSection($sectionname: String, $ownername: String){
        addSection(sectionname : $sectionname, ownername: $ownername){
            sectionname
        }
    }
`;

const AddItemMutation = gql`
    mutation addItem($name: String, $description: String, $price: String, $sectionname: String, $owneremail: String, $restaurantname: String, $cuisine: String){
        addItem(name : $name, description: $description, price: $price, sectionname: $sectionname, owneremail: $owneremail, restaurantname : $restaurantname, cuisine: $cuisine){
            sectionname
        }
    }
`;


export { addBookMutation, ownerSignupMutation, LoginMutation, UpdateOwnerMutation, AddSectionMutation, AddItemMutation, buyerSignupMutation };