package com.example

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.getOrHandle
import arrow.core.left
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.example.func.parse
import com.example.func.toEither
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import kotlinx.serialization.Serializable
import okhttp3.OkHttpClient
import okhttp3.Request
import java.math.BigInteger
import java.security.KeyFactory
import java.security.interfaces.RSAPublicKey
import java.security.spec.RSAPublicKeySpec
import java.time.Duration
import java.util.*

private const val SECONDS_OF_LEEWAY = 5L

@Serializable
private data class Jwks(val keys: List<JwksKey>)

@Serializable
private data class JwksKey(
    val use: String,
    val kty: String,
    val kid: String,
    val alg: String,
    val n: String,
    val e: String
)

fun Application.configureSecurity() {
    install(Authentication) {
        val jwks = getJwksKeys().getOrHandle { throw it }
        val key = jwks.keys.firstOrNull { it.use == "sig" && it.kty == "RSA" && it.alg == "RS256" }
            ?: throw IllegalStateException("No RSA public key found in JWKS")

        val nBytes = Base64.getUrlDecoder().decode(key.n)
        val eBytes = Base64.getUrlDecoder().decode(key.e)

        val n = BigInteger(1, nBytes)
        val e = BigInteger(1, eBytes)

        val spec = RSAPublicKeySpec(n, e)
        val keyFactory = KeyFactory.getInstance("RSA")
        val publicKey = keyFactory.generatePublic(spec) as RSAPublicKey
        val algorithm = Algorithm.RSA256(publicKey, null)

        jwt("jwt") {
            verifier(JWT.require(algorithm).acceptLeeway(SECONDS_OF_LEEWAY).build())
            validate { credential ->
                JWTPrincipal(credential.payload)
            }
        }
    }
}

private fun getJwksKeys(): Either<Error, Jwks> {
    val client = OkHttpClient()
    val url = "https://welcome-arachnid-31.clerk.accounts.dev/.well-known/jwks.json"
    val request = Request.Builder().url(url).get().build()

    val response = client.newCall(request).execute()
    return if (!response.isSuccessful) {
        Error("Failed to get public auth key").left()
    } else {
        response.body?.string().toEither().flatMap { Jwks.serializer().parse(it, false) }
    }
}