import { Blogs } from "@/app/lib/Blogs/models";
import { connectToDB } from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id } = params;
  const updateData = await req.json();

  await connectToDB();

  try {
    const updatedBlog = await Blogs.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures model validation
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { message: "Blog data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data Successfully Updated", data: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update blog data" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const hero = await Blogs.findOne({ _id: id });
  if (!hero) {
    return NextResponse.json(
      { message: "Hero data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ hero }, { status: 200 });
}
