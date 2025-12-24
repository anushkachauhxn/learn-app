import styles from "./styles.module.scss";

const CourseTags = ({ tags } : CourseTagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.cardTags}>
      {tags.map((tag: string, index: number) => (
        <span key={index} className={styles.tag}>
          {tag}
        </span>
      ))}
    </div>
  );
};

interface CourseTagsProps {
  tags: string[] | null | undefined;
}

export default CourseTags;