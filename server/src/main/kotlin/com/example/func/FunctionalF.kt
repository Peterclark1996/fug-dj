package com.example.func

import arrow.core.Either
import arrow.core.left
import arrow.core.right

fun <T> tryCatch(func: () -> T): Either<Error, T> =
    try { func().right() }
    catch (e: Throwable) { Error(e).left() }

fun <T> T?.toEither() = this?.right() ?: Error("No value").left()