# 🚀 Quick Start Guide

Get your Unraid mobile app running in 5 minutes!

## Step 1: Start the App (Already Done! ✅)

Your project is fully configured and ready to run.

## Step 2: Start Development Server

```bash
cd /Users/sangeetapapinwar/Developer/anraid
pnpm start
```

You'll see a QR code. Use this to run on your device!

## Step 3: Run on Your Device

### iOS
- Open Camera app
- Scan the QR code
- Tap the notification to open in Expo Go

### Android
- Open Expo Go app
- Tap "Scan QR code"
- Scan the QR code from terminal

## Step 4: Get Your Unraid API Key

On your Unraid server terminal:

```bash
unraid-api apikey --create
```

**Save this key somewhere safe!** You'll need it to login.

## Step 5: Login to the App

When the app opens:

1. **Server IP**: Enter your Unraid server IP address
   - Example: `192.168.1.100:3001`
   - Include the port number (usually 3001)

2. **API Key**: Paste the API key from Step 4

3. **Tap "Connect"**

That's it! You should now see your Unraid dashboard! 🎉

## 📱 App Features

### Dashboard Tab
- Real-time system monitoring
- CPU, Memory, Storage usage
- Disk health and temperatures
- Pull-to-refresh for manual updates
- Auto-refreshes every 5 seconds

### Settings Tab
- View server information
- Logout option

## 🔧 Troubleshooting

### "Cannot connect to server"
- ✅ Ensure your phone is on the same network as Unraid
- ✅ Verify server IP is correct
- ✅ Check Unraid API is running: `systemctl status unraid-api`

### "Invalid API key"
- ✅ Generate a new API key
- ✅ Make sure you copied it correctly (no extra spaces)

### "Network error"
- ✅ Check firewall settings on Unraid
- ✅ Verify port 3001 is accessible

## 🎨 Customization

### Change Auto-Refresh Interval

Edit `src/config/app.config.ts`:

```typescript
graphql: {
  defaultPollInterval: 5000, // Change this value (milliseconds)
}
```

### Enable GraphQL Code Generation

1. Update `codegen.ts` with your server IP
2. Run: `pnpm run codegen`
3. Get full TypeScript autocomplete for all queries!

## 📖 Need More Help?

- **Detailed Setup**: See `UNRAID_SETUP.md`
- **Project Overview**: See `README.md`
- **Architecture**: Check the `src/` directory structure

## 🏗️ Project Structure

```
anraid/
├── src/
│   ├── components/    # UI components
│   ├── screens/       # Login, Dashboard, Settings
│   ├── services/      # Auth, Storage services
│   ├── providers/     # Apollo, Auth providers
│   ├── hooks/         # Custom hooks
│   ├── graphql/       # GraphQL queries
│   ├── lib/           # Apollo client setup
│   ├── config/        # App configuration
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── app/               # Expo Router navigation
└── assets/            # Images and fonts
```

## 🚀 Next Steps

1. **Test the connection** with your Unraid server
2. **Explore the dashboard** and see real-time stats
3. **Customize** the polling interval if needed
4. **Add more features** - Docker management, VMs, etc.

## 💡 Pro Tips

- **Dark Mode**: Automatically follows your system theme
- **Pull to Refresh**: Swipe down on dashboard to refresh
- **Secure**: All credentials stored securely on device
- **Type-Safe**: Full TypeScript coverage prevents bugs

## 🎯 What's Included

✅ **Authentication System** - Login/logout with API key  
✅ **Real-time Dashboard** - System monitoring  
✅ **Apollo Client** - GraphQL integration  
✅ **Custom Services** - Auth & Storage services  
✅ **Type Safety** - Full TypeScript  
✅ **Dark Mode** - Light/dark themes  
✅ **Error Handling** - Comprehensive error management  
✅ **Settings Screen** - Server info & logout  
✅ **Professional UI** - Beautiful, modern design  
✅ **Modular Code** - Easy to extend  

## 📞 Support

If you run into issues:

1. Check the troubleshooting section above
2. Review `UNRAID_SETUP.md` for detailed docs
3. Verify your Unraid API is running and accessible

---

**Happy monitoring! 📊**

