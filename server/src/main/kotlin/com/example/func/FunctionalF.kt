package com.example.func

import arrow.core.Either
import arrow.core.left
import arrow.core.right

fun <T> tryCatch(func: () -> T): Either<Error, T> =
    try {
        func().right()
    } catch (e: Throwable) {
        Error(e).left()
    }

inline fun <T> tryCatchSuspend(func: () -> T): Either<Error, T> =
    try {
        func().right()
    } catch (e: Throwable) {
        Error(e).left()
    }

fun <T> tryCatchFlatMap(func: () -> Either<Error, T>): Either<Error, T> =
    try {
        func()
    } catch (e: Throwable) {
        Error(e).left()
    }

fun <T> T?.toEither(errorMessage: String = "No value") = this?.right() ?: NotFoundError(errorMessage).left()

fun Either<Error, Any>.mapToUnit() = this.map { }