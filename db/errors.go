package db

import "go.mongodb.org/mongo-driver/bson"

// ErrDB is what a database error entry contains
type ErrDB struct {
	From    string `json:"from" bson:"from"`       // the function that triggerd the adding of errors
	Message string `json:"message" bson:"message"` // the actual error message
	Package string `json:"package" bson:"package"` // the package from where the error came
	Meta    string `json:"meta" bson:"meta"`       // meta data if available
}

// GetErrors returns all errors in the database
func GetErrors() ([]ErrDB, error) {
	toReturn := []ErrDB{}

	collection := DB.Collection("appErrors")
	cur, err := collection.Find(C(), bson.M{})
	if err != nil {
		return toReturn, err
	}

	defer cur.Close(C())
	for cur.Next(C()) {
		var toAdd ErrDB
		err := cur.Decode(&toAdd)
		if err != nil {
			continue
		}
		toReturn = append(toReturn, toAdd)
	}

	return toReturn, nil
}

// AddErr can add an error to the database
func AddErr(insertError ErrDB) error {
	_, err := DB.Collection("appErrors").
		InsertOne(C(), insertError)
	return err
}

// AddErrArgs is a wrapper around db.AddErr() but with every strut item as function argument
func AddErrArgs(from, message, pkg string) {
	AddErr(ErrDB{
		From:    from,
		Message: message,
		Meta:    "",
		Package: pkg,
	})
}
