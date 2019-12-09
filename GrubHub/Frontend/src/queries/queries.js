import { gql } from 'apollo-boost';

const getAuthorsQuery = gql`
    {
        authors {
            name
            id
        }
    }
`;

const getBooksQuery = gql`
    {
        books {
            name
            id
        }
    }
`;

const getOwnerProfile = gql`
query getOwnerProfile($email: String){
    getOwnerProfile(email:$email){
        name,
        email,
        restaurantname,
        phone,
        cuisine
    }
  }
`;

const getOwnerSection = gql`
query getOwnerSection($ownername: String){
    getOwnerSection(ownername:$ownername){
            _id
            sectionname
    }
  }
`;

const getSectionDetails = gql`
query getSectionDetails($ownername: String, $sectionname: String){
    getSectionDetails(ownername:$ownername, sectionname:$sectionname){
            name,
            description,
            price,
            sectionname
    }
  }
`;

export { getAuthorsQuery, getBooksQuery, getOwnerProfile, getOwnerSection, getSectionDetails };