package com.example.mongo

import arrow.core.Either
import arrow.core.right
import arrow.core.traverseEither
import com.example.func.parse
import com.example.func.tryCatchFlatMap
import com.example.pojos.PlaylistDto
import com.example.pojos.SavedMediaDto
import com.mongodb.ConnectionString
import com.mongodb.MongoClientSettings
import com.mongodb.client.MongoClients
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.Filters
import com.mongodb.client.model.UpdateOptions
import org.bson.Document
import org.bson.types.ObjectId

private const val DATABASE_NAME = "fugdj"

data class MongoFunctions(
    val createMediaF: (userId: String, playlistId: String, media: SavedMediaDto) -> Either<Error, Unit>,
    val getAllPlaylists: (userId: String) -> Either<Error, List<PlaylistDto>>
)

fun buildMongoFunctions(mongoConnectionString: String) = MongoFunctions(
    createMediaF = { userId, playlistId, media ->
        callMongoTryCatch(mongoConnectionString) { database ->
            val collection: MongoCollection<Document> = database.getCollection("user_data")

            val arrayFilters = listOf(Filters.eq("playlist.id", playlistId))

            val removeOperation = Document(
                "\$pull",
                Document(
                    "playlists.\$[playlist].media",
                    Document("mediaId", media.mediaId)
                )
            )
            val removeOptions = UpdateOptions().arrayFilters(arrayFilters)

            collection.updateOne(Document("_id", ObjectId(userId)), removeOperation, removeOptions)

            val addOperation = Document(
                "\$push",
                Document(
                    "playlists.\$[playlist].media",
                    media.toBsonDocument()
                )
            )
            val addOptions = UpdateOptions().arrayFilters(arrayFilters)

            collection.updateOne(Document("_id", ObjectId(userId)), addOperation, addOptions)

            Unit.right()
        }
    },
    getAllPlaylists = { userId ->
        callMongoTryCatch(mongoConnectionString) { database ->
            val collection: MongoCollection<Document> = database.getCollection("user_data")

            val filter = Document("_id", ObjectId(userId))
            val projection = Document("playlists", 1)
            val result = collection.find(filter).projection(projection).first()

            val playlistDocs = result?.getList("playlists", Document::class.java) ?: emptyList()
            playlistDocs.traverseEither { PlaylistDto.serializer().parse(it) }
        }
    }
)

private fun <T> callMongoTryCatch(
    mongoConnectionString: String,
    f: (database: MongoDatabase) -> Either<Error, T>
): Either<Error, T> =
    tryCatchFlatMap {
        val mongoClientSettings = MongoClientSettings.builder()
            .applyConnectionString(ConnectionString(mongoConnectionString))
            .build()

        val mongoClient = MongoClients.create(mongoClientSettings)
        val database = mongoClient.getDatabase(DATABASE_NAME)

        val result = f(database)

        mongoClient.close()

        result
    }.mapLeft {
        Error("Mongo error: ${it.message}")
    }