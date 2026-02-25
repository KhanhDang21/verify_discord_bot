import os
import asyncio
from fastapi import FastAPI
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
ROLE_NAME = "Verified"

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

app = FastAPI()

# endpoint
@app.get("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "bot is running"}

# dis event
@bot.event
async def on_ready():
    print(f"Bot logged in as {bot.user}")


# verify command
@bot.command()
async def verify(ctx, birthday: str):
    print("VERIFY CALLED")

    async def delete_both(user_msg, bot_msg, delay=10):
        await asyncio.sleep(delay)
        try:
            await user_msg.delete()
        except:
            pass

        try:
            await bot_msg.delete()
        except:
            pass

    if birthday != "21/06/2004":
        bot_reply = await ctx.send("*** Sai ngày sinh rồi lạy bố!")
        asyncio.create_task(delete_both(ctx.message, bot_reply))
        return

    role = discord.utils.get(ctx.guild.roles, name=ROLE_NAME)

    if role is None:
        bot_reply = await ctx.send("*** Không tìm thấy role. Kiểm tra lại đi.")
        asyncio.create_task(delete_both(ctx.message, bot_reply))
        return

    try:
        await ctx.author.add_roles(role)
        bot_reply = await ctx.send("*** Bạn đã xác minh thành công! Chào mừng đến vùng đất linh hồn.")
        print("ADD ROLE SUCCESS")

        asyncio.create_task(delete_both(ctx.message, bot_reply))

    except Exception as e:
        print("ERROR ADD ROLE:", e)
        bot_reply = await ctx.send("*** Bot không có quyền cấp role.")
        asyncio.create_task(delete_both(ctx.message, bot_reply))

@bot.command()
async def ping(ctx):
    await ctx.send("pong")

@app.on_event("startup")
async def start_bot():
    loop = asyncio.get_event_loop()
    loop.create_task(bot.start(DISCORD_TOKEN))