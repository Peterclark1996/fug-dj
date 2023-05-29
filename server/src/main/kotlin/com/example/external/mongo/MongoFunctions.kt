package com.example.external.mongo

import arrow.core.Either
import arrow.core.right
import arrow.core.traverseEither
import com.example.func.encode
import com.example.func.mapToUnit
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
import com.mongodb.client.model.Updates
import org.bson.Document
import org.bson.types.ObjectId

private const val DATABASE_NAME = "fugdj"

data class MongoFunctions(
    val createMediaF: (userId: String, playlistId: String, media: SavedMediaDto) -> Either<Error, Unit>,
    val deleteMediaF: (userId: String, playlistId: String, mediaId: String) -> Either<Error, Unit>,
    val updateMediaDisplayNameF: (userId: String, playlistId: String, mediaId: String, displayName: String) -> Either<Error, Unit>,
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

            media.encode().map { mediaAsJson ->
                val addOperation = Document(
                    "\$push",
                    Document(
                        "playlists.\$[playlist].media",
                        Document.parse(mediaAsJson)
                    )
                )
                val addOptions = UpdateOptions().arrayFilters(arrayFilters)

                collection.updateOne(Document("_id", ObjectId(userId)), addOperation, addOptions)
            }.mapToUnit()
        }
    },
    deleteMediaF = { userId, playlistId, mediaId ->
        callMongoTryCatch(mongoConnectionString) { database ->
            val collection: MongoCollection<Document> = database.getCollection("user_data")

            val arrayFilters = listOf(Filters.eq("playlist.id", playlistId))

            val removeOperation = Document(
                "\$pull",
                Document(
                    "playlists.\$[playlist].media",
                    Document("mediaId", mediaId)
                )
            )
            val removeOptions = UpdateOptions().arrayFilters(arrayFilters)

            collection.updateOne(Document("_id", ObjectId(userId)), removeOperation, removeOptions)

            Unit.right()
        }
    },
    updateMediaDisplayNameF = { userId, playlistId, mediaId, displayName ->
        callMongoTryCatch(mongoConnectionString) { database ->
            val collection: MongoCollection<Document> = database.getCollection("user_data")

            val filter = Filters.and(
                Filters.eq("_id", ObjectId(userId)),
                Filters.eq("playlists.id", playlistId),
                Filters.eq("playlists.media.mediaId", mediaId)
            )

            val update = Updates.set("playlists.$.media.$[media].displayName", displayName)
            val arrayFilters = listOf(Filters.eq("media.mediaId", mediaId))

            collection.updateOne(filter, update, UpdateOptions().arrayFilters(arrayFilters))

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