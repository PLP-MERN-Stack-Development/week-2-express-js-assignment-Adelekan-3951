const { MongoClient } = require('mongodb');

async function main() {
  const uri = "YOUR_MONGODB_CONNECTION_STRING";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("plp_bookstore");
    const books = db.collection("books");

    const bookDocs = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-help",
        published_year: 2018,
        price: 15.99,
        in_stock: true,
        pages: 320,
        publisher: "Penguin"
      },
      // add 9 more book objects here ...
    ];

    await books.insertMany(bookDocs);
    console.log("Books inserted successfully.");
  } finally {
    await client.close();
  }
}

main().catch(console.error);
// Find all books in a specific genre, e.g., 'Self-help'
db.books.find({ genre: "Self-help" });

// Find books published after 2015
db.books.find({ published_year: { $gt: 2015 } });

// Find books by a specific author
db.books.find({ author: "James Clear" });

// Update the price of a specific book (e.g., title: "Atomic Habits")
db.books.updateOne(
  { title: "Atomic Habits" },
  { $set: { price: 17.99 } }
);

// Delete a book by its title
db.books.deleteOne({ title: "Some Book Title" });
// Count the number of books in stock
db.books.countDocuments({ in_stock: true });
// Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// Projection: return only title, author, and price
db.books.find(
  { in_stock: true },
  { title: 1, author: 1, price: 1, _id: 0 }
);

// Sorting books by price ascending
db.books.find().sort({ price: 1 });

// Sorting books by price descending
db.books.find().sort({ price: -1 });

// Pagination: 5 books per page, skip first 5 (page 2)
db.books.find().skip(5).limit(5);
// Aggregation: Count books by genre
db.books.aggregate([
  { $group: { _id: "$genre", count: { $sum: 1 } } }
]);
// Aggregation: Average price of books
db.books.aggregate([
  { $group: { _id: null, averagePrice: { $avg: "$price" } } }
]);
// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count
db.books.aggregate([
  {
    $group: {
      _id: { $subtract: [ { $year: { $toDate: { $concat: [ { $toString: "$published_year" }, "-01-01" ] } } }, { $mod: [ "$published_year", 10 ] } ] },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

// Create index on title field
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain to compare query plans before and after indexing
db.books.find({ title: "Atomic Habits" }).explain("executionStats");

db.books.find({ author: "James Clear", published_year: { $gt: 2015 } }).explain("executionStats");