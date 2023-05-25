package com.example.events

interface IOutboundEvent<T> {
    val type: OutboundEventType
    val data: T
}