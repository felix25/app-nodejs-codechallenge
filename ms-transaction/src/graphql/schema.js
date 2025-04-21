const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList, GraphQLID } = require('graphql');
const { getAllTransactions, getTransactionById } = require('../services/transactionService');

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: {
    id: { type: GraphQLID },
    accountExternalIdDebit: { type: GraphQLString },
    accountExternalIdCredit: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    status: { type: GraphQLString }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    transaction: {
      type: TransactionType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return getTransactionById(args.id);
      }
    },
    transactions: {
      type: new GraphQLList(TransactionType),
      resolve() {
        return getAllTransactions();
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
