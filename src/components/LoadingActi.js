import { ActivityIndicator } from 'react-native'
import React from 'react'

export default function LoadingActi({ loading, size, top }) {
    return (
        <ActivityIndicator
            animating={loading}
            color="#FF6B00"
            size={size ? size : "large"}
            style={{
                display: !loading ? 'none' : 'flex',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                zIndex: 1,
                top: top ? top : 100,
            }} />
    )
}