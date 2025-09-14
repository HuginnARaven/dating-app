using System;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExeptionMiddleware(
    RequestDelegate next,
    ILogger<ExeptionMiddleware> logger,
    IHostEnvironment env
    )
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{message}", ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = env.IsDevelopment()
            ? new ApiExeption(context.Response.StatusCode, ex.Message, ex.StackTrace)
            : new ApiExeption(context.Response.StatusCode, ex.Message, "Internal server error");

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}
